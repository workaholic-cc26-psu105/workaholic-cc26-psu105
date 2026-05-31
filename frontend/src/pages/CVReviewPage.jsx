import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── DEFAULT RESULT ─────────────────────────────────────
const DEFAULT_RESULT = {
  fileName: "CV kamu",
  date: "Baru saja",

  kecocokanUtama: "Belum ada hasil",

  kisaranGaji: "-",

  skor: 0,

  skills: [],

  kategori: [],

  saran: [],

  rekomendasi: [],
};

// ── SAFE JSON PARSE ─────────────────────────────────────
const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// ── NORMALIZE BACKEND RESULT ────────────────────────────
const normalizeResult = (data) => {
  if (!data) return DEFAULT_RESULT;

  const recommendations = data.rekomendasi || data.recommendations || [];

  const skills = Array.isArray(data.skills)
    ? data.skills
    : Array.isArray(data.skills_detected)
    ? data.skills_detected
    : [];

  const kategori = Array.isArray(data.kategori)
    ? data.kategori
    : Array.isArray(data.top3_categories)
    ? data.top3_categories.map((item) => item.category)
    : data.predicted_category
    ? [data.predicted_category]
    : data.kecocokan_utama
    ? [data.kecocokan_utama]
    : [];

  const saran = Array.isArray(data.saran)
    ? data.saran
    : data.saran
    ? [data.saran]
    : [];

  const skor =
    Number(
      data.skor ??
        data.ats_score ??
        data.atsScore ??
        data.confidence_pct ??
        data.confidence ??
        0
    ) || 0;

  return {
    fileName: data.fileName || data.file_name || data.filename || "CV kamu",
    date: data.date || "Baru saja",

    kecocokanUtama:
      data.kecocokanUtama ||
      data.kecocokan_utama ||
      data.predicted_category ||
      kategori[0] ||
      "-",

    kisaranGaji:
      data.kisaranGaji ||
      data.kisaran_gaji ||
      data.salaryRange ||
      data.salary_estimate?.salary_range ||
      "-",

    skor: Math.round(skor),

    skills,

    kategori,

    saran,

    rekomendasi: recommendations.map((job, index) => ({
      id: job.id || null,
      judul:
        job.judul ||
        job.jobTitle ||
        job.title ||
        `Rekomendasi ${index + 1}`,
      perusahaan: job.perusahaan || job.companyName || job.company || "-",
      lokasi: job.lokasi || job.locations || job.location || "-",
      tipe: job.tipe || job.employment || job.type || "-",
      gaji:
        job.gaji ||
        job.salary_range ||
        job.salaryRange ||
        "Tidak tersedia",
    })),
  };
};

// ── SKOR RING ─────────────────────────────────────
function SkorRing({ skor }) {
  const radius = 28;

  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (skor / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#F3E8E8"
          strokeWidth="7"
        />

        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#8B1A1A"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute text-sm font-extrabold text-[#8B1A1A]">
        {skor}%
      </span>
    </div>
  );
}

// ── CARD JOB ─────────────────────────────────────
function RekomJob({ job }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (job.id) {
      navigate(`/jobs/${job.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-white
        rounded-2xl
        p-5
        border border-gray-100
        hover:shadow-md
        hover:border-gray-200
        transition-all
        duration-300
        cursor-pointer
      "
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F2] text-[#8B1A1A] mb-2">
            {job.tipe}
          </span>

          <h4 className="font-extrabold text-gray-900 text-sm leading-tight">
            {job.judul}
          </h4>

          <p className="text-xs text-gray-500 mt-0.5">{job.perusahaan}</p>
        </div>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-gray-400 text-[11px]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
          </svg>

          {job.lokasi}
        </div>

        <span className="text-xs font-bold text-[#8B1A1A]">{job.gaji}</span>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────
export default function CVReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const result = useMemo(() => {
    try {
      const stateResult = location.state?.analysis || location.state?.result;

      const savedResult = safeJsonParse(
        localStorage.getItem("cvAnalysisResult")
      );

      const history = safeJsonParse(
        localStorage.getItem("cvAnalysisHistory"),
        []
      );

      const latestHistory =
        Array.isArray(history) && history.length > 0 ? history[0] : null;

      const finalResult = stateResult || savedResult || latestHistory;

      return finalResult ? normalizeResult(finalResult) : DEFAULT_RESULT;
    } catch (error) {
      console.log("Gagal load CV result:", error);
      return DEFAULT_RESULT;
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-sans antialiased">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-10 space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <rect
                  x="4"
                  y="2"
                  width="16"
                  height="20"
                  rx="2"
                  stroke="#8B1A1A"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 7h8M8 11h8M8 15h5"
                  stroke="#8B1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
              <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                <path
                  d="M2 6l2.5 2.5 5.5-5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#8B1A1A] tracking-tight leading-tight">
              Hasil Analisis CV Kamu
            </h1>

            <p className="text-xs text-gray-400 mt-0.5">
              {result.fileName} • {result.date}
            </p>
          </div>

          <button
            onClick={() => navigate("/analysis")}
            className="
              w-full sm:w-auto
              sm:ml-auto
              text-xs
              font-bold
              text-[#8B1A1A]
              border border-[#8B1A1A]/30
              px-4 py-2
              rounded-xl
              hover:bg-[#FDF2F2]
              transition-all
            "
          >
            Upload Ulang CV
          </button>
        </div>

        {/* KECOCOKAN */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <SkorRing skor={result.skor} />

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">
                  Kecocokan Utama
                </p>

                <p className="text-base md:text-lg font-extrabold text-gray-900 leading-tight">
                  {result.kecocokanUtama}
                </p>

                <p className="text-xs text-green-600 font-semibold mt-0.5">
                  Kesesuaian {result.skor}% dengan profilmu
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-gray-100"></div>

            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="#8B1A1A"
                    strokeWidth="1.8"
                  />

                  <path d="M2 10h20" stroke="#8B1A1A" strokeWidth="1.5" />

                  <circle cx="12" cy="15" r="2" fill="#8B1A1A" opacity=".5" />
                </svg>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">
                  Estimasi Kisaran Gaji
                </p>

                <p className="text-sm md:text-base font-extrabold text-gray-900 leading-tight break-words">
                  {result.kisaranGaji}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  Berdasarkan data pasar 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-5">
            {/* SKILL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
              <h2 className="text-sm font-extrabold text-gray-900 mb-4">
                Skill yang terdeteksi
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.skills?.length > 0 ? (
                  result.skills.map((skill, index) => (
                    <div
                      key={`${skill}-${index}`}
                      className="
                        px-3 py-2
                        rounded-xl
                        bg-[#FDF2F2]
                        text-[#8B1A1A]
                        text-xs font-bold
                      "
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    Belum ada skill yang terdeteksi.
                  </p>
                )}
              </div>
            </div>

            {/* KATEGORI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
              <h2 className="text-sm font-extrabold text-gray-900 mb-4">
                Kategori yang cocok
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.kategori?.length > 0 ? (
                  result.kategori.map((kat, index) => (
                    <div
                      key={`${kat}-${index}`}
                      className="
                        px-3 py-2
                        rounded-xl
                        bg-blue-50
                        text-blue-700
                        text-xs font-bold
                      "
                    >
                      {kat}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    Belum ada kategori yang cocok.
                  </p>
                )}
              </div>
            </div>

            {/* SARAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
              <h2 className="text-sm font-extrabold text-gray-900 mb-4">
                Saran Pengembangan Skill
              </h2>

              <div className="space-y-3">
                {result.saran?.length > 0 ? (
                  result.saran.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-[#8B1A1A]"></div>

                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    Belum ada saran pengembangan skill.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold text-[#8B1A1A]">
                Rekomendasi Pekerjaan
              </h2>

              <button
                onClick={() => navigate("/jobs")}
                className="text-xs font-bold text-gray-400 hover:text-[#8B1A1A]"
              >
                Lihat semua
              </button>
            </div>

            <div className="flex flex-col gap-3">
            {result.rekomendasi?.length > 0 ? (
              result.rekomendasi.map((job, index) => (
                <RekomJob
                  key={`${job.id || job.judul || "job"}-${index}`}
                  job={job}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">
                Belum ada rekomendasi pekerjaan.
              </p>
            )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}