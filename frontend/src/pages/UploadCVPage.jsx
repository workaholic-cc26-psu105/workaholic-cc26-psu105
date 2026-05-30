import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

export default function UploadCVPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  // MODAL TEMPLATE
  const [showTemplate, setShowTemplate] =
    useState(false);

  const inputRef = useRef(null);

  // VALIDASI FILE
  const validateFile = (selected) => {
    if (!selected)
      return "File tidak ditemukan.";

    if (
      selected.type !== "application/pdf"
    ) {
      return "CV wajib format PDF.";
    }

    if (
      selected.size >
      2 * 1024 * 1024
    ) {
      return "Ukuran file maksimal 2MB.";
    }

    return "";
  };

  // PILIH FILE
  const handleFileSelect = (
    selected
  ) => {
    const validation =
      validateFile(selected);

    if (validation) {
      setError(validation);
      return;
    }

    setError("");
    setFile(selected);
  };

  // DRAG
  const handleDragOver =
    useCallback((e) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

  const handleDragLeave =
    useCallback((e) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();

      setIsDragging(false);

      const dropped =
        e.dataTransfer.files?.[0];

      if (dropped) {
        handleFileSelect(dropped);
      }
    },
    []
  );

  // ANALISIS
  const handleAnalisis = () => {
    if (!file) {
      setError(
        "Silakan upload CV terlebih dahulu."
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // DATA HASIL ANALISIS
      const newAnalysis = {
        id: Date.now(),
        fileName: file.name,
        date:
          new Date().toLocaleDateString(
            "id-ID"
          ),

        ats: `${
          Math.floor(
            Math.random() * 20
          ) + 75
        }%`,

        atsScore: `${
          Math.floor(
            Math.random() * 20
          ) + 75
        }%`,

        category:
          "Frontend Developer",

        skor:
          Math.floor(
            Math.random() * 20
          ) + 75,

        kecocokanUtama:
          "Frontend Developer",

        kisaranGaji:
          "Rp 4.000.000 – Rp 8.000.000 / bulan",

        skills: [
          "HTML",
          "CSS",
          "JavaScript",
          "React",
          "Tailwind CSS",
        ],

        kategori: [
          "Frontend Developer",
          "UI/UX Designer",
          "Web Developer",
        ],

        saran: [
          "Pelajari React Hooks lebih lanjut",
          "Tingkatkan skill API Integration",
          "Tambahkan project portfolio modern",
          "Pelajari TypeScript untuk peluang lebih besar",
        ],

        rekomendasi: [
          {
            id: 1,
            judul:
              "Frontend Developer",
            perusahaan:
              "PT Digital Kreatif",
            lokasi: "Jakarta",
            tipe: "Full-time",
            gaji: "Rp 5jt – 8jt",
          },

          {
            id: 2,
            judul:
              "UI/UX Designer",
            perusahaan:
              "Startup Inovasi",
            lokasi: "Remote",
            tipe: "Remote",
            gaji: "Rp 4jt – 7jt",
          },

          {
            id: 3,
            judul:
              "Web Developer",
            perusahaan:
              "CV Teknologi Nusantara",
            lokasi: "Bandung",
            tipe: "Full-time",
            gaji: "Rp 4jt – 6jt",
          },
        ],
      };

      // AMBIL DATA LAMA
      const existingAnalysis =
        JSON.parse(
          localStorage.getItem(
            "cvAnalysisHistory"
          )
        ) || [];

      // SIMPAN DATA BARU
      localStorage.setItem(
        "cvAnalysisHistory",
        JSON.stringify([
          newAnalysis,
          ...existingAnalysis,
        ])
      );

      // STATUS SUDAH ANALISIS
      localStorage.setItem(
        "hasAnalysis",
        "true"
      );

      navigate("/review");
    }, 2500);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F7F7] px-4 md:px-6 py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] text-[#8B1A1A] px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles size={16} />
              AI CV Analyzer
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Upload CV
            </h1>

            <p className="text-gray-500 mt-4 max-w-2xl leading-relaxed mx-auto">
              Upload CV ATS Friendly agar AI
              dapat membaca dan
              menganalisis data secara lebih
              akurat
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

                  <p className="text-sm text-gray-400">
                    PDF ATS Friendly
                  </p>
                </div>
              </div>

              {/* UPLOAD BOX */}
              <div
                onDragOver={
                  handleDragOver
                }
                onDragLeave={
                  handleDragLeave
                }
                onDrop={handleDrop}
                onClick={() =>
                  inputRef.current?.click()
                }
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
                  <FileText
                    size={34}
                    className="text-[#8B1A1A]"
                  />
                </div>

                {!file ? (
                  <>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Drag & Drop CV
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      atau klik untuk upload
                      file PDF
                    </p>

                    <p className="text-xs text-gray-400 mt-5">
                      Maksimal ukuran file
                      2MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle2 size={20} />

                      <span className="font-bold">
                        CV berhasil dipilih
                      </span>
                    </div>

                    <p className="font-semibold text-gray-800 break-all">
                      {file.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const selected =
                      e.target.files?.[0];

                    if (selected) {
                      handleFileSelect(
                        selected
                      );
                    }

                    e.target.value = "";
                  }}
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <AlertTriangle
                    size={18}
                    className="text-red-500 mt-0.5"
                  />

                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={handleAnalisis}
                disabled={
                  !file || isLoading
                }
                className={`
                  w-full mt-6 py-4 rounded-2xl font-bold transition-all
                  ${
                    file
                      ? "bg-[#8B1A1A] hover:bg-[#701515] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isLoading
                  ? "Menganalisis CV..."
                  : "Analisis CV"}
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
                      Agar AI membaca lebih
                      akurat
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
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-green-600 shrink-0 mt-1"
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
                  Gunakan template CV ATS
                  Friendly agar peluang lolos
                  screening recruiter lebih
                  besar
                </p>

                <button
                  onClick={() =>
                    setShowTemplate(true)
                  }
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
          {/* CLOSE AREA */}
          <div
            className="absolute inset-0"
            onClick={() =>
              setShowTemplate(false)
            }
          />

          {/* CONTENT */}
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
            {/* CLOSE BUTTON */}
            <button
              onClick={() =>
                setShowTemplate(false)
              }
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

            {/* IMAGE TEMPLATE */}
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