import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import { addNotification } from "../utils/notification";

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
  "UI/UX Designer",
  "Data Analyst",
  "AI Engineer",
];

const normalizeJob = (job, index) => {
  return {
    id: job.id || job.job_id || job.jobId || `job-${index}`,

    judul:
      job.judul ||
      job.jobTitle ||
      job.job_title ||
      job.title ||
      "Tanpa Judul",

    perusahaan:
      job.perusahaan ||
      job.companyName ||
      job.company_name ||
      job.company ||
      "Perusahaan tidak disebutkan",

    lokasi:
      job.lokasi ||
      job.locations ||
      job.location ||
      "Lokasi tidak disebutkan",

    kategori:
      job.kategori ||
      job.categoriesName ||
      job.categories_name ||
      job.category ||
      "Tidak disebutkan",

    pendidikan:
      job.pendidikan ||
      job.education ||
      job.educationLevel ||
      job.minimumEducation ||
      "Tidak disebutkan",

    tipe:
      job.tipe ||
      job.employment ||
      job.employmentType ||
      "Tidak disebutkan",

    salary:
      job.salary ||
      job.gaji ||
      job.salary_range ||
      job.salaryRange ||
      "Gaji tidak dicantumkan",
  };
};

const getJobsFromResponse = (result) => {
  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.data?.jobs)) {
    return result.data.jobs;
  }

  if (Array.isArray(result?.jobs)) {
    return result.jobs;
  }

  return [];
};

const getMetaFromResponse = (result) => {
  return result?.meta || result?.data?.meta || {};
};

const getSavedJobId = (job) => {
  return job?.id || job?.job_id || job?.jobId || job?.job?.id || null;
};

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [keyword, setKeyword] = useState(
    searchParams.get("q") || searchParams.get("keyword") || ""
  );

  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSavedJobs([]);
        return;
      }

      const result = await apiRequest("/user/saved-jobs");

      setSavedJobs(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.log("Gagal memuat saved jobs:", error.message);
      setSavedJobs([]);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const params = new URLSearchParams();

        params.set("page", String(currentPage));
        params.set("per_page", String(JOBS_PER_PAGE));

        if (keyword.trim()) {
          params.set("keyword", keyword.trim());
        }

        if (lokasi !== "Semua Lokasi") {
          params.set("lokasi", lokasi);
        }

        if (kategori !== "Semua Kategori") {
          params.set("kategori", kategori);
        }

        const result = await apiRequest(`/jobs?${params.toString()}`);

        const rawJobs = getJobsFromResponse(result);
        const meta = getMetaFromResponse(result);

        const normalizedJobs = rawJobs.map((job, index) =>
          normalizeJob(job, index)
        );

        if (isMounted) {
          setJobs(normalizedJobs);
          setTotalJobs(meta.total || normalizedJobs.length);
          setTotalPages(meta.total_pages || 1);
        }
      } catch (error) {
        if (isMounted) {
          setJobs([]);
          setTotalJobs(0);
          setTotalPages(1);
          setErrorMessage(error.message || "Gagal memuat data lowongan.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [keyword, lokasi, kategori, currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSavedJobs();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchSavedJobs]);

  const handleSaveJob = async (e, job) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const wasSaved = savedJobs.some(
      (item) => getSavedJobId(item) === job.id
    );

    try {
      setIsSaving(job.id);

      await apiRequest(`/user/saved-jobs/${job.id}`, {
        method: "POST",
      });

      addNotification(
        wasSaved
          ? "Lowongan dihapus dari tersimpan"
          : "Lowongan berhasil disimpan"
      );

      await fetchSavedJobs();
    } catch (error) {
      alert(error.message || "Gagal menyimpan lowongan.");
    } finally {
      setIsSaving("");
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
    <div className="min-h-screen bg-[#F6F6F6] p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Cari Lowongan Kerja
        </h1>

        <p className="text-gray-500 mt-2">
          Temukan pekerjaan terbaik sesuai skill dan minatmu
        </p>
      </div>

      {/* SEARCH SECTION */}
      <div
        className="
          bg-[#C89696]
          rounded-[32px]
          p-6
          mb-8
          shadow-sm
        "
      >
        {/* SEARCH BAR */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-4
            gap-4
          "
        >
          {/* SEARCH */}
          <div
            className="
              lg:col-span-2
              flex items-center gap-3
              bg-white
              rounded-2xl
              px-4 py-4
              shadow-sm
            "
          >
            <Search size={20} className="text-gray-400" />

            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="
                bg-transparent
                outline-none
                w-full
                text-sm
              "
            />
          </div>

          {/* LOKASI */}
          <select
            value={lokasi}
            onChange={(e) => handleLokasiChange(e.target.value)}
            className="
              bg-white
              rounded-2xl
              px-4 py-4
              outline-none
              text-sm
              text-gray-700
              shadow-sm
            "
          >
            <option>Semua Lokasi</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Remote</option>
            <option>Bali</option>
          </select>

          {/* KATEGORI */}
          <select
            value={kategori}
            onChange={(e) => handleKategoriChange(e.target.value)}
            className="
              bg-white
              rounded-2xl
              px-4 py-4
              outline-none
              text-sm
              text-gray-700
              shadow-sm
            "
          >
            <option>Semua Kategori</option>
            <option>Data</option>
            <option>IT</option>
            <option>Design</option>
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
              className="
                px-4 py-2
                rounded-full
                bg-white/20
                text-white
                text-sm
                font-medium
                hover:bg-white
                hover:text-[#8B1A1A]
                transition-all
              "
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          {isLoading ? (
            "Memuat lowongan pekerjaan..."
          ) : (
            <>
              Menampilkan{" "}
              <span className="font-bold text-gray-800">{totalJobs}</span>{" "}
              lowongan pekerjaan
            </>
          )}
        </p>
      </div>

      {/* JOB GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {jobs.map((job) => {
          const isSaved = savedJobs.some(
            (item) => getSavedJobId(item) === job.id
          );

          return (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="
                bg-white
                rounded-[32px]
                border border-gray-100
                p-6
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                cursor-pointer
              "
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div
                  className="
                    w-14 h-14
                    rounded-2xl
                    bg-[#FDF2F2]
                    flex items-center justify-center
                  "
                >
                  <Briefcase size={24} className="text-[#8B1A1A]" />
                </div>

                {/* SAVE */}
                <button
                  onClick={(e) => handleSaveJob(e, job)}
                  disabled={isSaving === job.id}
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
                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      bg-[#FDF2F2]
                      text-[#8B1A1A]
                      text-xs
                      font-bold
                    "
                  >
                    {job.tipe}
                  </span>

                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      bg-blue-50
                      text-blue-700
                      text-xs
                      font-bold
                    "
                  >
                    {job.kategori}
                  </span>
                </div>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    text-gray-900
                  "
                >
                  {job.judul}
                </h2>

                <p className="text-gray-500 mt-1">{job.perusahaan}</p>
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
              <button
                className="
                  mt-7
                  w-full
                  bg-[#8B1A1A]
                  hover:bg-[#701515]
                  text-white
                  py-3.5
                  rounded-2xl
                  font-bold
                  transition-all
                "
              >
                Lihat Detail
              </button>
            </div>
          );
        })}
      </div>

      {/* EMPTY */}
      {!isLoading && jobs.length === 0 && (
        <div
          className="
            bg-white
            rounded-[32px]
            border border-gray-100
            p-16
            text-center
            mt-6
          "
        >
          <h3 className="text-xl font-bold text-gray-800">
            {errorMessage ? "Gagal memuat lowongan" : "Lowongan tidak ditemukan"}
          </h3>

          <p className="text-gray-500 mt-2">
            {errorMessage || "Coba gunakan kata kunci lain"}
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          className="
            flex items-center justify-center
            gap-3
            mt-10
          "
        >
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="
              w-11 h-11
              rounded-2xl
              bg-white
              border border-gray-200
              flex items-center justify-center
              disabled:opacity-40
            "
          >
            <ChevronLeft size={18} />
          </button>

          {/* PAGE */}
          <div
            className="
              px-5 py-3
              rounded-2xl
              bg-[#8B1A1A]
              text-white
              font-bold
            "
          >
            {currentPage}
          </div>

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="
              w-11 h-11
              rounded-2xl
              bg-white
              border border-gray-200
              flex items-center justify-center
              disabled:opacity-40
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}