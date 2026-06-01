import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import CopyrightFooter from "../components/CopyrightFooter";
import { apiRequest } from "../services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      setSuccessMessage(
        result?.message ||
          "Link reset password berhasil dikirim. Silakan cek email kamu."
      );
    } catch (error) {
      setError(
        error.message ||
          "Gagal mengirim link reset password. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8]">
      <LandingNavbar fixed />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-md bg-white rounded-[28px] shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#8B1A1A]">
              Lupa Kata Sandi
            </h1>

            <p className="text-gray-500 text-sm mt-3">
              Masukkan email akun Anda untuk menerima tautan reset password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#8B1A1A] mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="
                  w-full
                  bg-gray-100
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#8B1A1A]/20
                "
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-green-700 text-sm text-center font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                py-3.5
                rounded-xl
                bg-[#8B1A1A]
                text-white
                font-bold
                hover:bg-[#741616]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm font-semibold text-gray-500 hover:text-[#8B1A1A] transition"
            >
              Kembali ke Login
            </button>
          </form>
        </div>
      </main>

      <CopyrightFooter />
    </div>
  );
}