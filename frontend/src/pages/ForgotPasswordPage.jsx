import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import CopyrightFooter from "../components/CopyrightFooter";
import { apiRequest } from "../services/api";

// ── STEP 1: FORM EMAIL ───────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });

      onNext();
    } catch (error) {
      setError(error.message || "Gagal mengirim link reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-[28px] shadow-xl px-8 py-10">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-[#8B1A1A] text-center mb-3">
        Lupa Kata Sandi
      </h1>

      {/* Desc */}
      <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
        Masukkan email yang terdaftar untuk mengatur ulang kata sandi akun kamu.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="contoh@email.com"
            className={`w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 ${
              error ? "ring-2 ring-red-300" : ""
            }`}
          />

          {error && (
            <p className="text-xs text-red-500 font-semibold mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all disabled:opacity-60"
        >
          {isLoading ? "Mengirim..." : "Dapatkan Kata Sandi Baru"}
        </button>
      </form>
    </div>
  );
}

// ── STEP 2: SUCCESS MODAL ────────────────────────
function StepSuccess() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal */}
      <div className="bg-white rounded-[32px] shadow-2xl px-10 py-12 text-center w-[90%] max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
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

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-[#8B1A1A] mb-2">
          Berhasil!
        </h2>

        {/* Desc */}
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          Link reset password telah dikirim ke email kamu. Silakan cek inbox
          atau folder spam.
        </p>

        {/* Button */}
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
export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email");

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* Navbar */}
      <LandingNavbar fixed />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center bg-[#F0F0F0] pt-32 pb-32 relative min-h-[120vh]">
        {step === "email" && (
          <StepEmail onNext={() => setStep("success")} />
        )}

        {step === "success" && <StepSuccess />}
      </main>

      {/* Footer */}
      <CopyrightFooter />
    </div>
  );
}