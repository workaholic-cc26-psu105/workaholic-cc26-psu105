import { useCallback, useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Upload,
  Search,
  CheckCircle2,
  History,
  Trash2,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();

  const defaultUser = {
    nama: "User",
    role: "Fresh Graduate",
  };

  const [user, setUser] = useState(defaultUser);
  const [homeStats, setHomeStats] = useState({
    has_analysis: false,
    lowongan_cocok: 0,
    ats_score: 0,
    status_profile: "Active",
    latest_cv_analysis: null,
  });

  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const [profileResult, statsResult, historyResult] = await Promise.all([
        apiRequest("/user/profile"),
        apiRequest("/home/stats"),
        apiRequest("/cv/history"),
      ]);

      setUser({
        ...defaultUser,
        ...profileResult.data,
      });

      setHomeStats({
        has_analysis: statsResult.data?.has_analysis || false,
        lowongan_cocok: statsResult.data?.lowongan_cocok || 0,
        ats_score: statsResult.data?.ats_score || 0,
        status_profile: statsResult.data?.status_profile || "Active",
        latest_cv_analysis: statsResult.data?.latest_cv_analysis || null,
      });

      setAnalysisHistory(historyResult.data || []);

      localStorage.setItem(
        "userProfile",
        JSON.stringify(profileResult.data)
      );

      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHomeData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchHomeData]);

  const deleteHistory = async (id) => {
    const confirmDelete = window.confirm("Hapus riwayat analisis CV ini?");

    if (!confirmDelete) return;

    try {
      await apiRequest(`/cv/history/${id}`, {
        method: "DELETE",
      });

      setAnalysisHistory((prev) => prev.filter((item) => item.id !== id));

      await fetchHomeData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewHistory = (item) => {
    localStorage.setItem("selectedCVReview", JSON.stringify(item));
    navigate("/review");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <section className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm text-center">
          <h1 className="text-2xl font-black text-gray-900">
            Memuat dashboard...
          </h1>
        </section>
      </div>
    );
  }

  if (!homeStats.has_analysis) {
    return (
      <div className="space-y-6">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#8B1A1A] to-[#B03030] rounded-[32px] p-8 md:p-10 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-52 h-52 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
              <Sparkles size={14} />
              AI Career Assistant
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              Selamat Datang, {user.nama || "User"}
              <span className="inline-block ml-3">👋</span>
            </h1>

            <p className="text-white/80 leading-relaxed text-sm md:text-base max-w-2xl">
              Upload CV ATS Friendly untuk mendapatkan analisis AI dan
              rekomendasi pekerjaan yang sesuai dengan skill serta pengalamanmu
            </p>

            <div className="flex flex-col lg:flex-row gap-5 mt-10">
              {/* ANALISIS CV */}
              <button
                onClick={() => navigate("/analysis")}
                className="group bg-white text-[#8B1A1A] rounded-[28px] p-6 w-full lg:w-[340px] hover:scale-[1.02] transition-all shadow-2xl text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center mb-5">
                      <Upload size={24} />
                    </div>

                    <h3 className="text-2xl font-black">Analisis CV</h3>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Dapatkan ATS Score, skill insight, dan rekomendasi AI
                    </p>
                  </div>

                  <ArrowRight className="group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {/* CARI LOWONGAN */}
              <button
                onClick={() => navigate("/jobs")}
                className="group bg-white/10 border border-white/20 backdrop-blur-sm rounded-[28px] p-6 w-full lg:w-[340px] hover:bg-white/15 hover:scale-[1.02] transition-all text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                      <Search size={24} />
                    </div>

                    <h3 className="text-2xl font-black">Cari Lowongan</h3>

                    <p className="text-sm text-white/70 mt-2 leading-relaxed">
                      Jelajahi berbagai lowongan kerja terbaru sesuai minatmu
                    </p>
                  </div>

                  <ArrowRight className="group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ONBOARDING */}
        <section className="bg-white rounded-[32px] p-7 border border-gray-100 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              Mulai Career Journey-mu
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Ikuti langkah berikut untuk mendapatkan rekomendasi kerja berbasis AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center mb-5">
                <Upload className="text-[#8B1A1A]" size={24} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-[#FDF2F2] text-[#8B1A1A] px-3 py-1 rounded-full">
                  STEP 01
                </span>
              </div>

              <h3 className="font-black text-xl text-gray-900">Upload CV</h3>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Upload CV ATS Friendly dalam format PDF agar AI dapat membaca
                data dengan akurat
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                <Sparkles className="text-green-600" size={24} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  STEP 02
                </span>
              </div>

              <h3 className="font-black text-xl text-gray-900">Analisis AI</h3>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Sistem AI akan menganalisis skill, kategori, dan kecocokan
                profilemu
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <BriefcaseBusiness className="text-blue-600" size={24} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  STEP 03
                </span>
              </div>

              <h3 className="font-black text-xl text-gray-900">
                Rekomendasi Kerja
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Dapatkan rekomendasi pekerjaan terbaik berdasarkan hasil analisis AI
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8B1A1A] to-[#B03030] rounded-[32px] p-8 md:p-10 text-white">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-52 h-52 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-semibold mb-5 backdrop-blur-sm">
            <CheckCircle2 size={14} />
            CV Successfully Analyzed
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
            Selamat Datang, {user.nama || "User"}
            <span className="inline-block ml-3">👋</span>
          </h1>

          <p className="text-white/80 leading-relaxed text-sm md:text-base max-w-2xl">
            Berikut hasil rekomendasi pekerjaan berdasarkan analisis CV dan skill
            yang telah kamu upload
          </p>
        </div>
      </section>

      {/* HISTORY */}
      <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Riwayat Analisis CV
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Hasil analisis CV yang pernah dilakukan
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center">
            <History size={24} className="text-[#8B1A1A]" />
          </div>
        </div>

        {analysisHistory.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-3xl p-10 text-center">
            <FileText size={40} className="mx-auto text-gray-300 mb-4" />

            <h3 className="font-bold text-gray-700">
              Belum ada riwayat analisis
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Upload dan analisis CV untuk melihat riwayat di sini
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisHistory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-3xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      ATS Score {item.ats_score || 0}%
                    </div>

                    <h3 className="text-xl font-black text-gray-900">
                      {item.file_name || "CV Analysis"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Dianalisis pada {item.date || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewHistory(item)}
                      className="bg-[#8B1A1A] hover:bg-[#701515] text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all"
                    >
                      Lihat
                    </button>

                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="w-12 h-12 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Lowongan Cocok</p>

              <h2 className="text-3xl font-black text-gray-900 mt-2">
                {homeStats.lowongan_cocok}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center">
              <BriefcaseBusiness size={24} className="text-[#8B1A1A]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">ATS Score</p>

              <h2 className="text-3xl font-black text-gray-900 mt-2">
                {homeStats.ats_score}%
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Status Profile</p>

              <h2 className="text-xl font-black text-gray-900 mt-2">
                {homeStats.status_profile}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Sparkles size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}