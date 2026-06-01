import { useState } from "react";
import Navbar from "../components/Navbar";
import CopyrightFooter from "../components/CopyrightFooter";
import { useNavigate } from "react-router-dom";

// ── MAIN PAGE ────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle submit login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi sederhana
    if (!email || !password) {
      setErrorMsg("Email dan kata sandi tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    // Simulasi login
    setTimeout(() => {
      setIsLoading(false);
      setErrorMsg("Kata sandi salah. Silakan coba lagi.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-[#F0F0F0] py-10">
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-xl px-10 py-12">

          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-[#8B1A1A] text-center mb-10 tracking-tight">
            Masuk
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

            Masuk dengan Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
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

              {/* Lupa Password */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-semibold text-[#8B1A1A] hover:underline"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#8B1A1A] text-white font-bold text-sm rounded-xl hover:bg-[#701515] transition-all"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

            {/* Error */}
            {errorMsg && (
              <p className="text-sm text-[#8B1A1A] font-semibold text-center">
                {errorMsg}
              </p>
            )}
          </form>

          {/* Link Register */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#8B1A1A] font-bold hover:underline"
            >
              Daftar sekarang
            </button>
          </p>

        </div>
      </main>

      {/* Footer */}
      <CopyrightFooter />

    </div>
  );
}