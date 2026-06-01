# workaholic-cc26-psu105
Workaholic: Web Rekomendasi Kerja Berbasis Deep Learning

## 📂 Struktur Proyek
Proyek ini menggunakan arsitektur monorepo untuk menjaga keteraturan kode:

- `frontend/` : Semua kode tampilan antarmuka (UI/UX) berbasis React.
- `backend/` : Logika server, database, dan API.
- `ml/` : Model *Deep Learning*, skrip pemrosesan data, dan model *inference*.
- `data/` : Dataset yang digunakan untuk melatih model AI.
- `docs/` : Dokumentasi teknis, rancangan sistem, dan catatan rapat tim.

## 🤝 Git Workflow (Aturan Tim)
Untuk menjaga agar `main` branch tetap bersih, setiap anggota tim **wajib** mengikuti aturan ini:

1. **JANGAN** pernah melakukan *push* langsung ke branch `main`.
2. Buat *branch* baru untuk setiap fitur yang dikerjakan: `git checkout -b fitur/nama-fitur-nama-kamu`.
3. Lakukan *push* ke branch tersebut.
4. Buat **Pull Request (PR)** di GitHub untuk menggabungkan kode ke `main`.
5. Pastikan selalu melakukan `git pull origin main` sebelum mulai bekerja untuk mendapatkan update terbaru.
