import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CopyrightFooter from "../components/CopyrightFooter";

// ── STEP 1: FORM EMAIL ───────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi email
    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsLoading(true);

    // Simulasi API
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1000);
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
          className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all"
        >
          {isLoading ? "Mengirim..." : "Dapatkan Kata Sandi Baru"}
        </button>

      </form>
    </div>
  );
}

// ── STEP 2: RESET PASSWORD ───────────────────────
function StepResetPassword({ onNext }) {
  const [formData, setFormData] = useState({
    password: "",
    konfirmasi: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.konfirmasi) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (formData.password !== formData.konfirmasi) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    // Simulasi API
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1000);
  };

  // Eye Icon
  const EyeIcon = ({ show }) =>
    show ? (
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

  return (
    <div className="w-full max-w-sm bg-white rounded-[28px] shadow-xl px-8 py-10">

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Password Baru */}
        <div>
          <label className="block text-sm font-bold text-[#8B1A1A] mb-2">
            Kata Sandi Baru
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

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A]"
            >
              <EyeIcon show={showPassword} />
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
              name="konfirmasi"
              value={formData.konfirmasi}
              onChange={handleChange}
              placeholder="Ulangi kata sandi"
              className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30"
            />

            <button
              type="button"
              onClick={() => setShowKonfirmasi(!showKonfirmasi)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A]"
            >
              <EyeIcon show={showKonfirmasi} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 font-semibold text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#8B1A1A] text-white font-bold rounded-xl hover:bg-[#701515] transition-all"
        >
          {isLoading ? "Menyimpan..." : "Atur Ulang Kata Sandi"}
        </button>

      </form>
    </div>
  );
}

// ── STEP 3: SUCCESS MODAL ────────────────────────
function StepSuccess() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* Modal */}
      <div className="bg-white rounded-[32px] shadow-2xl px-10 py-12 text-center w-[90%] max-w-sm">

        {/* Icon */}
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

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-[#8B1A1A] mb-2">
          Berhasil!
        </h2>

        {/* Desc */}
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          Kata sandi berhasil diperbarui
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
      <Navbar />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center bg-[#F0F0F0] py-10 relative">

        {step === "email" && (
          <StepEmail onNext={() => setStep("reset")} />
        )}

        {step === "reset" && (
          <StepResetPassword onNext={() => setStep("success")} />
        )}

        {step === "success" && (
          <StepSuccess />
        )}

      </main>

      {/* Footer */}
      <CopyrightFooter />

    </div>
  );
}