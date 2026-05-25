"""
WORKAHOLIC API — BiLSTM + Salary Estimation
===========================================
Flask REST API untuk rekomendasi pekerjaan berbasis CV.

Model:
  - workaholic_bilstm.keras   : klasifikasi kategori CV
  - workaholic_encoder.keras  : encoder untuk cosine similarity
  - tokenizer.pkl             : Keras Tokenizer
  - label_encoder.pkl         : LabelEncoder (16 kategori)
  - job_embeddings.npy        : pre-computed BiLSTM embedding lowongan
  - jobs_meta.json            : metadata lowongan

Salary estimation TIDAK butuh model terpisah.
Cukup statistik P25/Median/P75 dari df_salary.csv.
"""

import os
import re
import json
import pickle
import logging
from pathlib import Path

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
log = logging.getLogger(__name__)

# ── Path config ───────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).resolve().parent.parent
MODELS_DIR  = BASE_DIR / 'model'
DATASET_DIR = BASE_DIR

# ── Konstanta ─────────────────────────────────────────────────────────────────
MAX_LEN       = 128
TOP_K_DEFAULT = 10
MIN_TEXT_LEN  = 20

ID_STOPWORDS = {
    'dan','atau','yang','di','ke','dari','ini','itu','juga','dengan','untuk',
    'pada','adalah','sebagai','dalam','tidak','akan','sudah','telah','saya',
    'kami','kita','ada','bisa','dapat','lebih','seperti','serta','bahwa',
    'namun','jika','the','and','or','is','are','was','were','be','been',
    'have','has','do','does','did','will','would','could','should','may',
    'might','shall','can','to','of','in','for','on','with','at','by',
    'from','as','an','a',
}

SKILL_KEYWORDS = [
    'python','java','javascript','typescript','react','vue','angular','nodejs',
    'django','flask','fastapi','spring','springboot','golang','rust','kotlin',
    'swift','flutter','dart','sql','mysql','postgresql','mongodb','redis',
    'elasticsearch','kafka','rabbitmq','docker','kubernetes','terraform',
    'ansible','jenkins','github','gitlab','cicd','aws','gcp','azure','linux',
    'bash','nginx','apache','tensorflow','pytorch','keras','scikit-learn',
    'pandas','numpy','matplotlib','spark','hadoop','airflow','dbt','tableau',
    'powerbi','looker','excel','figma','html','css','tailwind','bootstrap',
    'rest','graphql','grpc','microservices','agile','scrum',
    'penetration testing','vulnerability','firewall','siem','kali linux',
    'sap','oracle','erp','crm','network','cisco','ccna','vmware',
]

CATEGORY_SALARY_KEYWORDS = {
    'Data Scientist'                : ['data scientist','machine learning','ml engineer'],
    'Data Analyst'                  : ['data analyst','business analyst','analyst'],
    'Data Engineer'                 : ['data engineer','etl','big data'],
    'Backend Developer'             : ['backend','back-end','java developer','python developer','net developer'],
    'Frontend Developer'            : ['frontend','front-end','react developer','vue developer'],
    'Full Stack Developer'          : ['full stack','fullstack'],
    'Software Engineer'             : ['software engineer','software developer','programmer'],
    'Mobile Developer'              : ['mobile','android','ios','flutter developer'],
    'Web Developer'                 : ['web developer','web programmer'],
    'DevOps & Cloud'                : ['devops','cloud engineer','site reliability','sre'],
    'Database Administrator'        : ['database','dba','sql developer'],
    'Network & System Administrator': ['network','system administrator','sysadmin'],
    'Cybersecurity Analyst'         : ['security','cybersecurity','it security','soc analyst'],
    'IT Specialist'                 : ['it support','it specialist','technical support','helpdesk'],
    'Project Manager'               : ['project manager','it project','product manager'],
    'ERP & CRM Specialist'          : ['erp','crm','sap','oracle consultant'],
}

# ── Load artifacts ────────────────────────────────────────────────────────────
log.info('Loading model artifacts...')
try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    from sklearn.metrics.pairwise import cosine_similarity

    model       = tf.keras.models.load_model(str(MODELS_DIR / 'workaholic_bilstm.keras'))
    embed_model = tf.keras.models.load_model(str(MODELS_DIR / 'workaholic_encoder.keras'))

    with open(MODELS_DIR / 'tokenizer.pkl', 'rb') as f:
        tokenizer = pickle.load(f)
    with open(MODELS_DIR / 'label_encoder.pkl', 'rb') as f:
        label_encoder = pickle.load(f)

    job_embeddings = np.load(str(MODELS_DIR / 'job_embeddings.npy'))

    with open(MODELS_DIR / 'jobs_meta.json', 'r') as f:
        jobs_meta = json.load(f)

    # Load df_salary untuk estimasi gaji
    sal_path = DATASET_DIR / 'df_salary.csv'
    df_sal   = pd.read_csv(sal_path, low_memory=False)
    df_sal['salary_mid'] = pd.to_numeric(df_sal['salary_mid'], errors='coerce')

    log.info(f'Model loaded. Categories: {len(label_encoder.classes_)}, Jobs: {len(jobs_meta)}')

except Exception as e:
    log.error(f'FATAL: Gagal load artifacts — {e}')
    raise

# ── Utility functions ─────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    text   = str(text).lower()
    text   = re.sub(r'[^a-z0-9\s]', ' ', text)
    tokens = [t for t in text.split() if t not in ID_STOPWORDS and len(t) > 1]
    return ' '.join(tokens)


def predict_category(cv_text: str):
    cleaned = clean_text(cv_text)
    if not cleaned:
        return 'Unknown', 0.0, []
    seq    = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(seq, maxlen=MAX_LEN, padding='post', truncating='post')
    probs  = model.predict(padded, verbose=0)[0]
    idx    = int(np.argmax(probs))
    top3   = [
        {'category': label_encoder.classes_[i], 'confidence_pct': round(float(probs[i]) * 100, 2)}
        for i in np.argsort(probs)[::-1][:3]
    ]
    return label_encoder.classes_[idx], round(float(probs[idx]) * 100, 2), top3


def detect_skills(text: str) -> list:
    t = text.lower()
    return [kw for kw in SKILL_KEYWORDS if kw in t]


def recommend_jobs(cv_text: str, top_k: int = TOP_K_DEFAULT) -> list:
    cleaned  = clean_text(cv_text)
    seq      = tokenizer.texts_to_sequences([cleaned])
    padded   = pad_sequences(seq, maxlen=MAX_LEN, padding='post', truncating='post')
    cv_embed = embed_model.predict(padded, verbose=0)
    sims     = cosine_similarity(cv_embed, job_embeddings)[0]
    top_idx  = np.argsort(sims)[::-1][:top_k]
    results  = []
    for rank, i in enumerate(top_idx, 1):
        job     = jobs_meta[i] if i < len(jobs_meta) else {}
        sal_min = job.get('salaryMin', '')
        sal_max = job.get('salaryMax', '')
        try:
            salary_range = f'Rp {int(float(sal_min)):,} - Rp {int(float(sal_max)):,}' \
                           if sal_min and sal_max and float(sal_max) > 0 else 'Tidak tersedia'
        except Exception:
            salary_range = 'Tidak tersedia'
        results.append({
            'rank'          : rank,
            'jobTitle'      : job.get('jobTitle', 'Unknown'),
            'companyName'   : job.get('companyName', 'Unknown'),
            'locations'     : job.get('locations', '-'),
            'employment'    : job.get('employment', '-'),
            'categoriesName': job.get('categoriesName', '-'),
            'similarity_pct': round(float(sims[i]) * 100, 2),
            'salary_range'  : salary_range,
        })
    return results


def estimate_salary(category: str) -> dict:
    keywords = CATEGORY_SALARY_KEYWORDS.get(category, [category.lower()])
    mask     = df_sal['jobTitle'].str.lower().apply(
        lambda t: any(kw in str(t) for kw in keywords)
    )
    subset   = df_sal[mask]['salary_mid'].dropna()
    if subset.empty:
        subset  = df_sal['salary_mid'].dropna()
        note    = 'Estimasi berdasarkan data gaji keseluruhan'
        matched = False
    else:
        note    = f'Berdasarkan {len(subset):,} data kategori "{category}"'
        matched = True
    p25 = int(subset.quantile(0.25))
    med = int(subset.median())
    p75 = int(subset.quantile(0.75))
    return {
        'available'        : True,
        'category_matched' : matched,
        'salary_p25'       : p25,
        'salary_median'    : med,
        'salary_p75'       : p75,
        'salary_range'     : f'Rp {p25:,} - Rp {p75:,} / bulan',
        'salary_median_fmt': f'Rp {med:,} / bulan',
        'sample_count'     : int(len(subset)),
        'note'             : note,
    }


def extract_text_pdf(pdf_path: str) -> str:
    try:
        import pdfplumber
        pages = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    pages.append(t)
        text = ' '.join(pages).strip()
        if text:
            return text
    except Exception as e:
        log.warning(f'pdfplumber gagal: {e}')
    from pypdf import PdfReader
    reader = PdfReader(pdf_path)
    return ' '.join(p.extract_text() or '' for p in reader.pages).strip()




CATEGORY_SARAN = {
    'Data Scientist'                : 'Perkuat skill machine learning, statistik, dan Python. Tambahkan portofolio proyek di Kaggle atau GitHub.',
    'Data Analyst'                  : 'Kuasai SQL, Excel, dan tools visualisasi seperti Tableau atau Power BI. Latih kemampuan storytelling data.',
    'Data Engineer'                 : 'Pelajari pipeline ETL, Apache Spark, dan cloud platform seperti AWS atau GCP.',
    'Backend Developer'             : 'Perdalam arsitektur REST API, database design, dan keamanan aplikasi.',
    'Frontend Developer'            : 'Tingkatkan skill React/Vue, perhatikan performa dan aksesibilitas UI.',
    'Full Stack Developer'          : 'Kuasai frontend dan backend secara merata, pelajari DevOps dasar.',
    'Software Engineer'             : 'Perkuat struktur data, algoritma, dan design pattern. Aktif berkontribusi di open source.',
    'Mobile Developer'              : 'Fokus pada Flutter atau React Native untuk cross-platform, pelajari optimasi performa mobile.',
    'Web Developer'                 : 'Kuasai HTML/CSS/JavaScript modern, pelajari framework populer dan SEO dasar.',
    'DevOps & Cloud'                : 'Pelajari Kubernetes, Terraform, dan CI/CD pipeline. Dapatkan sertifikasi cloud.',
    'Database Administrator'        : 'Kuasai query optimization, backup/recovery, dan database security.',
    'Network & System Administrator': 'Ambil sertifikasi CCNA atau CompTIA. Pelajari network security dan cloud infrastructure.',
    'Cybersecurity Analyst'         : 'Pelajari ethical hacking, ambil sertifikasi CEH atau OSCP. Latih analisis malware.',
    'IT Specialist'                 : 'Tingkatkan kemampuan troubleshooting dan problem solving. Pelajari manajemen layanan IT dan ambil sertifikasi CompTIA A+ atau Google IT Support Professional.',
    'Project Manager'               : 'Ambil sertifikasi PMP atau Scrum Master. Kuasai tools manajemen proyek seperti Jira.',
    'ERP & CRM Specialist'          : 'Pelajari modul SAP atau Oracle lebih dalam, kuasai proses bisnis end-to-end.',
}

def generate_saran(category: str, skills: list) -> str:
    base = CATEGORY_SARAN.get(category, 'Terus tingkatkan skill teknis dan portofolio Anda.')
    if len(skills) < 3:
        base += ' Tambahkan lebih banyak skill teknis yang relevan ke CV Anda.'
    return base

# ── Flask App ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # max 16MB


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'message': 'WORKAHOLIC BiLSTM API is running'}), 200


@app.get('/info')
def info():
    return jsonify({
        'status'           : 'success',
        'model_name'       : 'workaholic_bilstm',
        'architecture'     : 'Embedding + 2x BiLSTM + Dense',
        'salary_method'    : 'Statistical P25/Median/P75 dari df_salary.csv',
        'categories'       : list(label_encoder.classes_),
        'num_classes'      : len(label_encoder.classes_),
        'total_jobs'       : len(jobs_meta),
        'supported_formats': ['pdf', 'text'],
        'api_version'      : '3.0',
    }), 200


@app.get('/categories')
def categories():
    return jsonify({
        'status'    : 'success',
        'categories': list(label_encoder.classes_),
        'count'     : len(label_encoder.classes_),
    }), 200


@app.get('/salary/<string:category>')
def salary_by_category(category: str):
    estimate = estimate_salary(category)
    return jsonify({'status': 'success', 'category': category, **estimate}), 200


@app.post('/predict')
def predict_from_pdf():
    """Prediksi dari file PDF. Form field: file (required), top_k (optional)."""
    file_path = None
    try:
        if 'file' not in request.files:
            return jsonify({'status': 'error', 'message': "Field 'file' tidak ditemukan"}), 400
        file = request.files['file']
        if not file or not file.filename:
            return jsonify({'status': 'error', 'message': 'Nama file kosong'}), 400
        ext = os.path.splitext(file.filename)[1].lower()
        if ext != '.pdf':
            return jsonify({'status': 'error', 'message': f'Format "{ext}" tidak didukung. Hanya PDF.'}), 400

        top_k     = max(1, min(int(request.form.get('top_k', TOP_K_DEFAULT)), 50))
        file_path = f'/tmp/cv_{os.getpid()}.pdf'
        file.save(file_path)

        cv_text = extract_text_pdf(file_path)
        if not cv_text or len(cv_text.strip()) < MIN_TEXT_LEN:
            return jsonify({'status': 'error', 'message': 'Teks terlalu pendek. Pastikan PDF bukan scan gambar.'}), 400

        category, confidence, top3 = predict_category(cv_text)
        skills = detect_skills(cv_text)
        salary = estimate_salary(category)
        jobs   = recommend_jobs(cv_text, top_k=top_k)
        saran  = generate_saran(category, skills)
        return jsonify({
            'status'            : 'success',
            'file_name'         : file.filename,
            'text_length'       : len(cv_text),
            'text_preview'      : cv_text[:300],
            # Field baru (untuk frontend)
            'kategori'          : category,
            'ats_score'         : confidence,
            'kecocokan_utama'   : category,
            'kisaran_gaji'      : salary['salary_range'],
            'skills'            : skills,
            'saran'             : saran,
            'rekomendasi'       : jobs,
            # Field lama (tetap ada)
            'predicted_category': category,
            'confidence_pct'    : confidence,
            'top3_categories'   : top3,
            'skills_detected'   : skills,
            'skill_count'       : len(skills),
            'recommendations'   : jobs,
            'salary_estimate'   : salary,
        }), 200

    except Exception as e:
        log.exception('Error di /predict')
        return jsonify({'status': 'error', 'message': f'Server Error: {str(e)}'}), 500
    finally:
        if file_path and os.path.exists(file_path):
            try: os.remove(file_path)
            except: pass


@app.post('/predict-text')
def predict_from_text():
    """Prediksi dari teks JSON. Body: {text: str, top_k: int}."""
    try:
        data = request.get_json(silent=True)
        if not data or 'text' not in data:
            return jsonify({'status': 'error', 'message': "Field 'text' diperlukan"}), 400
        cv_text = str(data['text']).strip()
        if len(cv_text) < MIN_TEXT_LEN:
            return jsonify({'status': 'error', 'message': f'Teks minimal {MIN_TEXT_LEN} karakter'}), 400

        top_k = max(1, min(int(data.get('top_k', TOP_K_DEFAULT)), 50))
        category, confidence, top3 = predict_category(cv_text)
        skills = detect_skills(cv_text)
        salary = estimate_salary(category)
        jobs   = recommend_jobs(cv_text, top_k=top_k)
        saran  = generate_saran(category, skills)
        return jsonify({
            'status'            : 'success',
            # Field baru (untuk frontend)
            'kategori'          : category,
            'ats_score'         : confidence,
            'kecocokan_utama'   : category,
            'kisaran_gaji'      : salary['salary_range'],
            'skills'            : skills,
            'saran'             : saran,
            'rekomendasi'       : jobs,
            # Field lama (tetap ada)
            'predicted_category': category,
            'confidence_pct'    : confidence,
            'top3_categories'   : top3,
            'skills_detected'   : skills,
            'skill_count'       : len(skills),
            'recommendations'   : jobs,
            'salary_estimate'   : salary,
        }), 200

    except Exception as e:
        log.exception('Error di /predict-text')
        return jsonify({'status': 'error', 'message': f'Server Error: {str(e)}'}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({'status': 'error', 'message': 'Endpoint tidak ditemukan'}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({'status': 'error', 'message': 'Method tidak diizinkan'}), 405

@app.errorhandler(413)
def file_too_large(e):
    return jsonify({'status': 'error', 'message': 'File terlalu besar (max 16MB)'}), 413


if __name__ == '__main__':
    print('\n' + '=' * 55)
    print('   WORKAHOLIC API v3.0 — BiLSTM')
    print('=' * 55)
    print(f'  Model     : Embedding + 2x BiLSTM + Dense')
    print(f'  Salary    : Statistical (P25-Median-P75)')
    print(f'  Kategori  : {len(label_encoder.classes_)}')
    print(f'  Lowongan  : {len(jobs_meta):,}')
    print()
    print('  Endpoints:')
    print('    GET  /health          → Health check')
    print('    GET  /info            → Model info')
    print('    GET  /categories      → 16 kategori')
    print('    GET  /salary/<cat>    → Estimasi gaji')
    print('    POST /predict         → Prediksi dari PDF')
    print('    POST /predict-text    → Prediksi dari teks JSON')
    print()
    print('  Server: http://localhost:5000')
    print('=' * 55 + '\n')
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
