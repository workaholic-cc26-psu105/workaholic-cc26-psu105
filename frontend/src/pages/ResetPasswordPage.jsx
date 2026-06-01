import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import CopyrightFooter from "../components/CopyrightFooter";

// ── EYE ICON ─────────────────────────────────────
function EyeIcon({ show }) {
  return show ? (
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
  );
}

// ── SUCCESS MODAL ────────────────────────────────
function SuccessModal() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[28px] shadow-2xl p-8 w-full max-w-sm text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8"
            >
              <path
                d="M7 12.5l3 3 7-7"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-[#8B1A1A] mb-2">
          Berhasil!
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Kata sandi berhasil diperbarui
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!password || !konfirmasi) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== konfirmasi) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4]">

      {/* NAVBAR */}
      <LandingNavbar fixed />

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">

        <div className="w-full max-w-lg bg-white rounded-[28px] shadow-xl p-8 md:p-10">

          <h1 className="text-3xl font-extrabold text-[#8B1A1A] text-center mb-2">
            Reset Kata Sandi
          </h1>

          <p className="text-center text-gray-400 text-sm mb-8">
            Masukkan kata sandi baru untuk akun kamu
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Kata sandi baru
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* KONFIRMASI */}
            <div>
              <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
                Konfirmasi kata sandi baru
              </label>

              <div className="relative">
                <input
                  type={
                    showKonfirmasi
                      ? "text"
                      : "password"
                  }
                  value={konfirmasi}
                  onChange={(e) =>
                    setKonfirmasi(e.target.value)
                  }
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowKonfirmasi(
                      !showKonfirmasi
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeIcon show={showKonfirmasi} />
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-center text-red-500 text-sm font-semibold">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all disabled:opacity-60"
            >
              {isLoading
                ? "Menyimpan..."
                : "Atur ulang kata sandi"}
            </button>

          </form>
        </div>

      </main>

      {/* FOOTER */}
      <CopyrightFooter />

      {/* SUCCESS POPUP */}
      {isSuccess && <SuccessModal />}

    </div>
  );
}