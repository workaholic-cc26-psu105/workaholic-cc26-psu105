# Proyek Analisis Data: Job Posting Indonesia

## 📂 Struktur Direktori
submission
├── dashboard
│   ├── loker_clean.csv      <- Dataset bersih siap pakai untuk dashboard
│   └── dashboard.py         <- Aplikasi Streamlit
├── data
│   ├── mergeFile.csv        <- Dataset mentah (unduh dari Kaggle: https://www.kaggle.com/datasets/azizainunnajib/jobs-crawling)
│   └── loker_clean.csv      <- Dataset hasil preprocessing
├── notebook.ipynb
├── README.md
├── requirements.txt
└── url.txt

## ❓ Pertanyaan Bisnis
1. Kategori pekerjaan apa yang paling banyak dibutuhkan di Indonesia berdasarkan data lowongan 2021-2022, dan apakah dominasi kategori tersebut konsisten di semua kota besar?
2. Kota mana yang paling banyak membuka lowongan kerja di Indonesia berdasarkan data 2021-2022, dan bagaimana persebarannya dibandingkan dengan kota-kota di luar Pulau Jawa?
3. Bagaimana perbandingan rata-rata kisaran gaji antar kategori pekerjaan di Indonesia berdasarkan data 2021-2022, dan kategori mana yang menawarkan gap terbesar antara gaji minimum dan maksimum?
4. Apakah tipe pekerjaan (Full-time, Contract, Internship) berpengaruh terhadap kisaran gaji yang ditawarkan pada kategori yang sama?
5. Bagaimana distribusi lowongan kerja berdasarkan tipe pekerjaan, dan apakah ada perbedaan signifikan antar kota?

---

## 🔧 Setup Environment

### Menggunakan Conda
```bash
conda create --name main-ds python=3.9
conda activate main-ds
pip install -r requirements.txt
```

### Menggunakan venv (pip)
```bash
python -m venv venv

# Aktifkan virtual environment:
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## 📥 Download Dataset

Dataset mentah (`mergeFile.csv`) tidak disertakan di repositori ini karena ukurannya 285MB.
Unduh terlebih dahulu dari Kaggle:

🔗 https://www.kaggle.com/datasets/azizainunnajib/jobs-crawling

Setelah diunduh, letakkan file `mergeFile.csv` di folder `data/`.

---

## 🚀 Menjalankan Dashboard

Pastikan virtual environment sudah aktif, lalu jalankan dari **root folder submission**:

```bash
cd ds-dashboard
python -m streamlit run dashboard/dashboard.py
```

Buka browser di: **http://localhost:8501**

---

## 📓 Menjalankan Notebook

```bash
jupyter notebook notebook.ipynb
```

---

## 📊 Teknik Analisis yang Digunakan
- **Data Wrangling**: Gathering, Assessing (info, describe, missing values, duplikat), Cleaning
- **EDA**: Eksplorasi distribusi tipe pekerjaan, kelengkapan data, dan ketersediaan gaji
- **Visualisasi & Explanatory Analysis**: Matplotlib & Seaborn
- **Feature Engineering**: Label Encoding, TF-IDF Vectorization, MinMax Scaling