import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CopyrightFooter from "../components/CopyrightFooter";

// ── MAIN PAGE ────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Success Popup
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Validasi kosong
    if (
      !formData.nama ||
      !formData.email ||
      !formData.password ||
      !formData.konfirmasiPassword
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Validasi email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid.");
      return;
    }

    // Validasi password
    if (formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    // Konfirmasi password
    if (formData.password !== formData.konfirmasiPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    // Simulasi register
    setTimeout(() => {
      setIsLoading(false);

      // munculkan popup sukses
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-[#F0F0F0] py-10 px-4">

        {/* Register Card */}
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-xl px-10 py-12">

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-[#8B1A1A] text-center mb-10 tracking-tight">
            Daftar
          </h1>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3.5 px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all mb-6 shadow-sm">

            {/* Google Icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>

            Lanjutkan dengan Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Nama */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Kata Sandi
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
                />

                {/* Toggle Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Konfirmasi Kata Sandi
              </label>

              <div className="relative">
                <input
                  type={showKonfirmasi ? "text" : "password"}
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleChange}
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
                />

                {/* Toggle Konfirmasi */}
                <button
                  type="button"
                  onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A] transition-colors"
                >
                  {showKonfirmasi ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 font-semibold text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#8B1A1A] text-white font-bold text-sm rounded-xl hover:bg-[#701515] transition-all"
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#8B1A1A] font-bold hover:underline"
            >
              Masuk sekarang
            </button>
          </p>
        </div>

        {/* SUCCESS POPUP */}
        {isSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

            <div className="bg-white rounded-[32px] shadow-2xl p-10 w-full max-w-md">

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-9 h-9"
                  >
                    <path
                      d="M7 12.5L10.5 16L17 9"
                      stroke="#22C55E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-2xl font-extrabold text-[#8B1A1A] text-center mb-3">
                Berhasil Mendaftar
              </h2>

              <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
                Akun kamu berhasil dibuat. Silakan masuk untuk melanjutkan.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all"
              >
                Masuk Sekarang
              </button>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <CopyrightFooter />
    </div>
  );
}