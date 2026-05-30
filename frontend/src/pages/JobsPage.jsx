import { useEffect, useState, useCallback } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { apiRequest } from "../services/api";

import {
  Search,
  MapPin,
  Bookmark,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock3,
} from "lucide-react";

const JOBS_PER_PAGE = 6;

const POPULAR_SEARCH = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "AI Engineer",
];

// ── MAIN PAGE ─────────────────────────────────────
export default function JobsPage() {
const navigate = useNavigate();

const [searchParams] = useSearchParams();

const [keyword, setKeyword] = useState("");
const [lokasi, setLokasi] = useState("Semua Lokasi");
const [kategori, setKategori] = useState("Semua Kategori");
const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
  const q = searchParams.get("q") || "";

  setKeyword(q);
  setCurrentPage(1);
}, [searchParams]);

  // ── FETCH JOBS FROM BACKEND ─────────────────────
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

  const params = new URLSearchParams();

      params.append("page", currentPage);
      params.append("per_page", JOBS_PER_PAGE);

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      if (lokasi !== "Semua Lokasi") {
        params.append("lokasi", lokasi);
      }

      if (kategori !== "Semua Kategori") {
        params.append("kategori", kategori);
      }

      const result = await apiRequest(`/jobs?${params.toString()}`);

      setJobs(result.data || []);
      setTotalJobs(result.meta?.total || 0);
      setTotalPages(result.meta?.total_pages || 1);
    } catch (error) {
      setErrorMsg(error.message);
      setJobs([]);
      setTotalJobs(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, keyword, lokasi, kategori]);

  // ── FETCH SAVED JOBS FROM BACKEND ───────────────
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const result = await apiRequest("/user/saved-jobs");
      setSavedJobs(result.data || []);
    } catch (error) {
      console.error(error.message);
    }
  };

useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchJobs();
  }, 300);

  return () => clearTimeout(timeoutId);
}, [fetchJobs]);

useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchSavedJobs();
  }, 0);

  return () => clearTimeout(timeoutId);
}, []);

  // ── SAVE JOB ─────────────────────────────
  const handleSaveJob = async (e, job) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const result = await apiRequest(`/user/saved-jobs/${job.id}`, {
        method: "POST",
      });

      if (result.saved) {
        setSavedJobs((prev) => [...prev, job]);
      } else {
        setSavedJobs((prev) =>
          prev.filter((item) => item.id !== job.id)
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleLokasiChange = (value) => {
    setLokasi(value);
    setCurrentPage(1);
  };

  const handleKategoriChange = (value) => {
    setKategori(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Cari Lowongan Kerja
        </h1>

        <p className="text-gray-500 mt-2">
          Temukan pekerjaan terbaik sesuai skill dan minatmu
        </p>
      </div>

      {/* SEARCH SECTION */}
      <div className="bg-[#C89696] rounded-[32px] p-6 mb-8 shadow-sm">
        {/* SEARCH BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* SEARCH */}
          <div className="lg:col-span-2 flex items-center gap-3 bg-white rounded-2xl px-4 py-4 shadow-sm">
            <Search size={20} className="text-gray-400" />

            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* LOKASI */}
          <select
            value={lokasi}
            onChange={(e) => handleLokasiChange(e.target.value)}
            className="bg-white rounded-2xl px-4 py-4 outline-none text-sm text-gray-700 shadow-sm"
          >
            <option>Semua Lokasi</option>
            <option>Jakarta</option>
            <option>Jakarta Selatan</option>
            <option>Jakarta Barat</option>
            <option>Jakarta Pusat</option>
            <option>Jakarta Utara</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Yogyakarta</option>
            <option>Semarang</option>
            <option>Bekasi</option>
            <option>Bali</option>
            <option>Remote</option>
          </select>

          {/* KATEGORI */}
          <select
            value={kategori}
            onChange={(e) => handleKategoriChange(e.target.value)}
            className="bg-white rounded-2xl px-4 py-4 outline-none text-sm text-gray-700 shadow-sm"
          >
            <option>Semua Kategori</option>
            <option>IT</option>
            <option>Data</option>
            <option>Design</option>
            <option>Komputer/Teknologi Informasi</option>
            <option>Akuntansi</option>
            <option>Penjualan</option>
            <option>Manufaktur</option>
          </select>
        </div>

        {/* POPULAR SEARCH */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <p className="text-sm font-semibold text-white">
            Paling sering dicari:
          </p>

          {POPULAR_SEARCH.map((item) => (
            <button
              key={item}
              onClick={() => handleKeywordChange(item)}
              className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white hover:text-[#8B1A1A] transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Menampilkan{" "}
          <span className="font-bold text-gray-800">
            {totalJobs}
          </span>{" "}
          lowongan pekerjaan
        </p>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 text-center mb-6">
          <p className="text-gray-500 font-semibold">
            Memuat lowongan kerja...
          </p>
        </div>
      )}

      {/* ERROR */}
      {errorMsg && (
        <div className="bg-white rounded-[32px] border border-red-100 p-10 text-center mb-6">
          <p className="text-red-500 font-semibold">
            {errorMsg}
          </p>
        </div>
      )}

      {/* JOB GRID */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const isSaved = savedJobs.some(
              (item) => item.id === job.id
            );

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                {/* TOP */}
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center">
                    <Briefcase size={24} className="text-[#8B1A1A]" />
                  </div>

                  {/* SAVE */}
                  <button
                    onClick={(e) => handleSaveJob(e, job)}
                    className={`
                      w-11 h-11
                      rounded-2xl
                      flex items-center justify-center
                      transition-all

                      ${
                        isSaved
                          ? "bg-[#8B1A1A] text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-[#FDF2F2] hover:text-[#8B1A1A]"
                      }
                    `}
                  >
                    <Bookmark
                      size={18}
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#FDF2F2] text-[#8B1A1A] text-xs font-bold">
                      {job.tipe}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {job.kategori}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-gray-900">
                    {job.judul}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {job.perusahaan}
                  </p>
                </div>

                {/* INFO */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {job.lokasi}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock3 size={16} />
                    {job.salary}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GraduationCap size={16} />
                    {job.pendidikan}
                  </div>
                </div>

                {/* BUTTON */}
                <button className="mt-7 w-full bg-[#8B1A1A] hover:bg-[#701515] text-white py-3.5 rounded-2xl font-bold transition-all">
                  Lihat Detail
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && jobs.length === 0 && (
        <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center mt-6">
          <h3 className="text-xl font-bold text-gray-800">
            Lowongan tidak ditemukan
          </h3>

          <p className="text-gray-500 mt-2">
            Coba gunakan kata kunci lain
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {/* PAGE */}
          <div className="px-5 py-3 rounded-2xl bg-[#8B1A1A] text-white font-bold">
            {currentPage}
          </div>

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}