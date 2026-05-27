# Workaholic Backend API

Backend API untuk platform **Workaholic**, yaitu web rekomendasi kerja berbasis AI yang membantu pengguna mendapatkan rekomendasi lowongan kerja berdasarkan CV. Backend ini dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase**.

---

## Tech Stack

- Node.js
- Express.js
- Supabase Database
- Supabase Auth
- Supabase Storage
- Multer
- Axios
- CSV Parser

---

## Project Structure

```txt
backend/
├── scripts/
│   └── importJobs.js
├── src/
│   ├── config/
│   │   ├── supabase.js
│   │   ├── supabaseAdmin.js
│   │   └── devUser.js
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── services/
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## Installation

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Server berjalan di:

```txt
http://localhost:5000
```

Untuk production:

```bash
npm start
```

---

## Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```env
PORT=5000

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DEV_USER_ID=

AI_BASE_URL=
USE_AI_MOCK=true

FRONTEND_RESET_PASSWORD_URL=http://localhost:5173/reset-password
```

Keterangan:

| Variable | Fungsi |
|---|---|
| `PORT` | Port backend |
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Key khusus backend untuk akses admin, seperti upload avatar |
| `DEV_USER_ID` | User ID dummy untuk kebutuhan development tertentu |
| `AI_BASE_URL` | URL API service AI |
| `USE_AI_MOCK` | Mengaktifkan mock CV analysis jika AI belum siap |
| `FRONTEND_RESET_PASSWORD_URL` | URL halaman reset password frontend |

> Jangan commit file `.env` ke GitHub.

---

## API Base URL

Local development:

```txt
http://localhost:5000/api
```

Production example:

```txt
https://api.workaholic.id/v1
```

---

## Authentication

Beberapa endpoint membutuhkan token login.

Format header:

```txt
Authorization: Bearer <token>
```

Token diperoleh dari endpoint:

```txt
POST /api/auth/login
```

---

## Main Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrasi akun baru | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/forgot-password` | Mengirim link reset password | Public |
| POST | `/api/auth/reset-password` | Mengubah password baru | Public |

---

### User Profile

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/user/profile` | Mengambil data profil user | Required |
| PUT | `/api/user/profile` | Memperbarui data profil user | Required |
| POST | `/api/user/avatar` | Upload avatar user | Required |

---

### Jobs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/jobs` | Mengambil daftar lowongan dengan pagination dan filter | Public/Auth |
| GET | `/api/jobs/:id` | Mengambil detail lowongan berdasarkan ID | Public/Auth |
| GET | `/api/jobs/categories` | Mengambil daftar kategori lowongan | Public/Auth |
| GET | `/api/jobs/locations` | Mengambil daftar lokasi lowongan | Public/Auth |

Query parameter untuk `/api/jobs`:

```txt
keyword
lokasi
kategori
tipe
page
per_page
```

Contoh:

```txt
GET /api/jobs?keyword=backend&lokasi=Jakarta&page=1&per_page=6
```

---

### Saved Jobs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/user/saved-jobs` | Mengambil daftar lowongan tersimpan milik user | Required |
| POST | `/api/user/saved-jobs/:id` | Toggle simpan/unsimpan lowongan | Required |
| DELETE | `/api/user/saved-jobs/:id` | Menghapus lowongan dari daftar simpan | Required |

---

### CV Analysis

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/cv/analyze` | Upload dan analisis CV | Required |
| GET | `/api/cv/history` | Mengambil riwayat analisis CV user | Required |
| DELETE | `/api/cv/history/:id` | Menghapus riwayat analisis CV | Required |

Request `POST /api/cv/analyze` menggunakan `multipart/form-data`.

Field file:

```txt
cv_file
```

Format file:

```txt
PDF maksimal 2MB
```

---

### Home Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/home/stats` | Mengambil statistik dashboard user | Required |

---

## Standard Response

Success response:

```json
{
  "success": true,
  "data": {}
}
```

Success response with message:

```json
{
  "success": true,
  "message": "Data berhasil diproses",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

Validation error example:

```json
{
  "success": false,
  "message": "Validasi gagal"
}
```

---

## Jobs Dataset Import

Dataset lowongan kerja berasal dari file:

```txt
data/loker_clean.csv
```

File dataset disimpan di luar folder backend:

```txt
workaholic-cc26-psu105/
├── backend/
├── frontend/
└── data/
    └── loker_clean.csv
```

Untuk import dataset ke Supabase:

```bash
node scripts/importJobs.js
```

Catatan:

- Dataset tidak di-commit ke GitHub.
- File CSV diabaikan melalui `.gitignore`.
- Data jobs akan disimpan ke tabel `jobs` di Supabase.
- Untuk development, data yang di-import dapat dibatasi agar proses lebih ringan.

---

## AI Integration

Fitur analisis CV mendukung dua mode:

### Mock Mode

Digunakan saat API AI belum aktif atau belum stabil.

```env
USE_AI_MOCK=true
```

Pada mode ini, backend tetap dapat mengembalikan hasil analisis CV dummy agar frontend tetap bisa berjalan.

### Real AI Mode

Digunakan saat API AI sudah siap.

```env
USE_AI_MOCK=false
AI_BASE_URL=https://url-ai-service
```

Backend akan mengirim file PDF ke endpoint AI:

```txt
POST /predict
```

Field yang dikirim ke AI:

```txt
file
```

Catatan:

- Frontend tetap mengirim file ke backend dengan field `cv_file`.
- Backend meneruskan file ke AI dengan field `file`.
- Jika URL AI berubah, cukup update `AI_BASE_URL`.

---

## Supabase Storage

Upload avatar menggunakan Supabase Storage bucket:

```txt
avatars
```

Endpoint yang menggunakan bucket ini:

```txt
POST /api/user/avatar
```

Request menggunakan `multipart/form-data`.

Field file:

```txt
avatar
```

Format file yang didukung:

```txt
JPG, PNG, WEBP
```

Ukuran maksimal:

```txt
2MB
```

---

## Database Notes

Beberapa tabel utama yang digunakan:

```txt
jobs
wishlists
cv_analyses
user_profiles
```

Beberapa data seperti pendidikan, pengalaman, level, website perusahaan, dan jumlah karyawan tidak tersedia sebagai kolom khusus di dataset. Jika data tidak ditemukan, backend menggunakan fallback seperti:

```txt
Tidak disebutkan
Gaji tidak dicantumkan
Perusahaan tidak disebutkan
```

Fallback ini digunakan agar response tetap aman untuk frontend dan tidak menyebabkan error tampilan.

---

## Deployment Notes

Untuk deploy backend ke Render, gunakan konfigurasi berikut:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Pastikan environment variable di Render sudah diisi sesuai `.env.example`.

---

## Current Status

Fitur backend yang sudah tersedia:

- Auth register dan login
- Forgot password dan reset password
- User profile
- Upload avatar
- Jobs list dengan pagination dan filter
- Job detail
- Saved jobs per user
- CV analysis per user
- CV history per user
- Delete CV history
- Home stats per user
- Integrasi AI service dengan mock mode

---

## Important Notes

- Jangan commit file `.env`.
- Jangan commit dataset CSV atau file model `.pkl`.
- Gunakan `USE_AI_MOCK=true` jika API AI belum siap.
- Gunakan `USE_AI_MOCK=false` jika API AI sudah aktif.
- Semua endpoint user-based menggunakan Bearer Token dari login.