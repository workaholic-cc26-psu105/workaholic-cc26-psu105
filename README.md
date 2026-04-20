# Proyek Analisis Data: E-Commerce Public Dataset

## 📂 Struktur Direktori
```
submission
├── dashboard
│   ├── main_data.csv        <- Dataset terintegrasi siap pakai untuk dashboard
│   └── dashboard.py         <- Aplikasi Streamlit
├── data
│   ├── customers_dataset.csv
│   ├── geolocation_dataset.csv
│   ├── order_items_dataset.csv
│   ├── order_payments_dataset.csv
│   ├── order_reviews_dataset.csv
│   ├── orders_dataset.csv
│   ├── products_dataset.csv
│   ├── sellers_dataset.csv
│   └── product_category_name_translation.csv
├── notebook.ipynb
├── README.md
├── requirements.txt
└── url.txt
```

## ❓ Pertanyaan Bisnis
1. Kategori produk apa yang menghasilkan revenue tertinggi pada periode **Januari 2017 – Agustus 2018**, dan bagaimana tren revenue bulanannya?
2. Bagaimana hubungan antara ketepatan waktu pengiriman dengan skor ulasan pelanggan pada periode **Januari 2017 – Agustus 2018**, dan di negara bagian mana tingkat keterlambatan paling tinggi?

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

## 🚀 Menjalankan Dashboard

Pastikan virtual environment sudah aktif, lalu jalankan dari **root folder submission**:

```bash
streamlit run dashboard/dashboard.py
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
- **EDA**: Eksplorasi distribusi, korelasi, dan tren data
- **Visualisasi**: Matplotlib & Seaborn
- **RFM Analysis**: Segmentasi 7 grup pelanggan
- **Geospatial Analysis**: Peta distribusi pelanggan berdasarkan lokasi geografis
