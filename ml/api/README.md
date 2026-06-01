# 🤖 Workaholic ML API

API berbasis **BiLSTM** untuk analisis CV dan rekomendasi pekerjaan. Dibangun dengan Flask dan di-deploy di Hugging Face Spaces.

🔗 **Base URL:** `https://syiifac-workaholic-api.hf.space`

---

## Fitur

- **Klasifikasi CV** — mendeteksi kategori pekerjaan dari isi CV (16 kategori)
- **Rekomendasi Lowongan** — mencocokkan CV dengan lowongan menggunakan cosine similarity
- **Deteksi Skill** — mengekstrak skill teknis yang disebutkan dalam CV
- **Estimasi Gaji** — memberikan estimasi gaji berdasarkan kategori (P25 / Median / P75)
- **Saran Pengembangan** — memberikan saran karier berdasarkan kategori dan skill yang terdeteksi

---

## Model

| Komponen | Keterangan |
|---|---|
| `workaholic_bilstm.keras` | Model klasifikasi kategori CV |
| `workaholic_encoder.keras` | Encoder untuk cosine similarity |
| `tokenizer.pkl` | Keras Tokenizer |
| `label_encoder.pkl` | LabelEncoder (16 kategori) |
| `job_embeddings.npy` | Pre-computed embedding lowongan |
| `jobs_meta.json` | Metadata lowongan |
| `df_salary.csv` | Data gaji untuk estimasi statistik |

Arsitektur: `Embedding → 2x BiLSTM → Dense`

---

## Endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/health` | Status API |
| GET | `/info` | Info model & konfigurasi |
| GET | `/categories` | Daftar 16 kategori pekerjaan |
| GET | `/salary/{category}` | Estimasi gaji per kategori |
| POST | `/predict` | Prediksi dari file PDF (`multipart/form-data`) |
| POST | `/predict-text` | Prediksi dari teks JSON (`application/json`) |

> File PDF maksimal 16MB · Teks minimal 20 karakter · PDF harus berupa teks (bukan scan gambar)
