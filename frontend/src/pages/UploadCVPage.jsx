import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { addNotification } from "../utils/notification";

import {
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

const validateFile = (selected) => {
  if (!selected) {
    return "File tidak ditemukan.";
  }

  if (selected.type !== "application/pdf") {
    return "CV wajib format PDF.";
  }

  if (selected.size > 2 * 1024 * 1024) {
    return "Ukuran file maksimal 2MB.";
  }

  return "";
};

const normalizeJobId = (id) => {
  if (typeof id === "string" && id.length > 10 && id.includes("-")) {
    return id;
  }

  return null;
};

export default function UploadCVPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const inputRef = useRef(null);

  const handleFileSelect = useCallback((selected) => {
    const validation = validateFile(selected);

    if (validation) {
      setError(validation);
      return;
    }

    setError("");
    setFile(selected);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const dropped = e.dataTransfer.files?.[0];

      if (dropped) {
        handleFileSelect(dropped);
      }
    },
    [handleFileSelect]
  );

  const handleAnalisis = async () => {
    if (!file) {
      setError("Silakan upload CV terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("cv_file", file);

      const result = await apiRequest("/cv/analyze", {
        method: "POST",
        body: formData,
      });

      const analysis = result?.data || result;

      if (!analysis) {
        throw new Error("Response analisis CV tidak valid.");
      }

      const normalizedRecommendations = Array.isArray(analysis?.rekomendasi)
        ? analysis.rekomendasi.map((job) => ({
            id: normalizeJobId(job.id),
            judul: job.judul || job.jobTitle || job.title || "-",
            perusahaan: job.perusahaan || job.companyName || job.company || "-",
            lokasi: job.lokasi || job.locations || job.location || "-",
            tipe: job.tipe || job.employment || job.type || "-",
            gaji:
              job.gaji ||
              job.salary_range ||
              job.salaryRange ||
              job.salary ||
              "Tidak tersedia",
          }))
        : [];

      const normalizedAnalysis = {
        ...analysis,

        id: analysis?.id || null,
        file_name: analysis?.file_name || file.name,
        date: analysis?.date || "Baru saja",
        ats_score: analysis?.ats_score || 0,
        kecocokan_utama: analysis?.kecocokan_utama || "-",
        kisaran_gaji: analysis?.kisaran_gaji || "-",

        skills: Array.isArray(analysis?.skills) ? analysis.skills : [],

        kategori: Array.isArray(analysis?.kategori) ? analysis.kategori : [],

        saran: Array.isArray(analysis?.saran)
          ? analysis.saran
          : analysis?.saran
          ? [analysis.saran]
          : [],

        rekomendasi: normalizedRecommendations,

        fileName: analysis?.file_name || file.name,
        skor: analysis?.ats_score || 0,
        ats: `${analysis?.ats_score || 0}%`,
        atsScore: `${analysis?.ats_score || 0}%`,
        category: analysis?.kecocokan_utama || "-",
        kecocokanUtama: analysis?.kecocokan_utama || "-",
        kisaranGaji: analysis?.kisaran_gaji || "-",
      };

      localStorage.setItem(
        "selectedCVReview",
        JSON.stringify(normalizedAnalysis)
      );

      localStorage.setItem(
        "cvAnalysisResult",
        JSON.stringify(normalizedAnalysis)
      );

      const oldHistory = JSON.parse(
        localStorage.getItem("cvAnalysisHistory") || "[]"
      );

      localStorage.setItem(
        "cvAnalysisHistory",
        JSON.stringify([normalizedAnalysis, ...oldHistory])
      );

      localStorage.setItem("hasAnalysis", "true");

      window.dispatchEvent(new Event("profileUpdated"));

      addNotification("CV berhasil diupload dan dianalisis");

      navigate("/review", {
        state: {
          analysis: normalizedAnalysis,
        },
      });
    } catch (error) {
      setError(error.message || "Gagal menganalisis CV.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F7F7] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] text-[#8B1A1A] px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles size={16} />
              AI CV Analyzer
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Upload CV
            </h1>

            <p className="text-gray-500 mt-4 max-w-2xl leading-relaxed mx-auto">
              Upload CV ATS Friendly agar AI dapat membaca dan menganalisis data
              secara lebih akurat
            </p>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] flex items-center justify-center">
                  <Upload className="text-[#8B1A1A]" />
                </div>

                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg">
                    Upload CV
                  </h2>

                  <p className="text-sm text-gray-400">PDF ATS Friendly</p>
                </div>
              </div>

              {/* UPLOAD BOX */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-[28px]
                  p-10 text-center cursor-pointer transition-all
                  ${
                    isDragging
                      ? "border-[#8B1A1A] bg-[#FDF2F2]"
                      : "border-gray-200 hover:border-[#8B1A1A]/40"
                  }
                `}
              >
                <div className="w-20 h-20 rounded-3xl bg-[#FDF2F2] flex items-center justify-center mx-auto mb-5">
                  <FileText size={34} className="text-[#8B1A1A]" />
                </div>

                {!file ? (
                  <>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Drag & Drop CV
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      atau klik untuk upload file PDF
                    </p>

                    <p className="text-xs text-gray-400 mt-5">
                      Maksimal ukuran file 2MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle2 size={20} />

                      <span className="font-bold">CV berhasil dipilih</span>
                    </div>

                    <p className="font-semibold text-gray-800 break-all">
                      {file.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];

                    if (selected) {
                      handleFileSelect(selected);
                    }

                    e.target.value = "";
                  }}
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <AlertTriangle size={18} className="text-red-500 mt-0.5" />

                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={handleAnalisis}
                disabled={!file || isLoading}
                className={`
                  w-full mt-6 py-4 rounded-2xl font-bold transition-all
                  ${
                    file
                      ? "bg-[#8B1A1A] hover:bg-[#701515] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isLoading ? "Menganalisis CV..." : "Analisis CV"}
              </button>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* KETENTUAN */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="text-green-600" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-gray-900 text-lg">
                      Ketentuan CV
                    </h2>

                    <p className="text-sm text-gray-400">
                      Agar AI membaca lebih akurat
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "CV wajib format PDF",
                    "Gunakan template ATS Friendly",
                    "Isi identitas dengan jelas",
                    "Hindari desain terlalu ramai",
                    "Pastikan teks dapat dibaca sistem",
                    "Gunakan PDF berbasis teks, bukan hasil konversi gambar atau scan",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-[18px] h-[18px] text-green-600 mt-0.5 shrink-0"
                      />

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEMPLATE */}
              <div className="bg-gradient-to-r from-[#8B1A1A] to-[#B03030] rounded-[32px] p-8 text-white">
                <h2 className="text-2xl font-extrabold leading-tight">
                  Belum punya CV ATS?
                </h2>

                <p className="text-white/80 text-sm mt-3 leading-relaxed">
                  Gunakan template CV ATS Friendly agar peluang lolos screening
                  recruiter lebih besar
                </p>

                <button
                  onClick={() => setShowTemplate(true)}
                  className="mt-6 bg-white text-[#8B1A1A] px-6 py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all"
                >
                  Download Template CV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-[32px] p-10 shadow-2xl text-center w-[320px]">
              <div className="w-16 h-16 border-4 border-[#8B1A1A]/20 border-t-[#8B1A1A] rounded-full animate-spin mx-auto mb-5"></div>

              <h3 className="font-extrabold text-gray-900 text-lg">
                AI sedang menganalisis CV
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Mohon tunggu beberapa detik...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TEMPLATE CV */}
      {showTemplate && (
        <div
          className="
            fixed inset-0 z-[999]
            bg-black/50
            backdrop-blur-sm
            flex items-center justify-center
            p-5
          "
        >
          <div
            className="absolute inset-0"
            onClick={() => setShowTemplate(false)}
          />

          <div
            className="
              relative z-10
              bg-white
              rounded-[32px]
              p-5
              max-w-4xl
              w-full
              shadow-2xl
              animate-in fade-in zoom-in
            "
          >
            <button
              onClick={() => setShowTemplate(false)}
              className="
                absolute top-5 right-5
                w-11 h-11
                rounded-2xl
                bg-gray-100
                hover:bg-gray-200
                flex items-center justify-center
                transition-all
              "
            >
              <X size={20} />
            </button>

            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Template CV ATS Friendly
              </h2>
            </div>

            <div className="rounded-[24px] overflow-hidden border border-gray-200 max-h-[75vh] overflow-y-auto">
              <img
                src="/template-cv-ats.jpg"
                alt="Template CV ATS"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}