import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// ── DUMMY DATA ─────────────────────────────────────
const DUMMY_JOBS = Array(24)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,

    judul: [
      "Frontend Developer",
      "Backend Developer",
      "UI/UX Designer",
      "AI Engineer",
      "Data Analyst",
      "Fullstack Developer",
    ][i % 6],

    perusahaan: [
      "PT Workaholic Digital",
      "Tech Nusantara",
      "Sky Labs",
      "Future Tech",
      "AI Indonesia",
      "Inovasi Digital",
    ][i % 6],

    lokasi: [
      "Jakarta",
      "Bandung",
      "Surabaya",
      "Remote",
      "Yogyakarta",
      "Bali",
    ][i % 6],

    kategori: [
      "IT",
      "IT",
      "Design",
      "IT",
      "Data",
      "IT",
    ][i % 6],

    pendidikan: [
      "S1",
      "D3",
      "Fresh Graduate",
      "SMA/SMK",
    ][i % 4],

    tipe: [
      "Full Time",
      "Remote",
      "Hybrid",
      "Internship",
    ][i % 4],

    salary: [
      "Rp 5jt - 7jt",
      "Rp 7jt - 10jt",
      "Rp 4jt - 6jt",
      "Rp 8jt - 12jt",
    ][i % 4],
  }));

const JOBS_PER_PAGE = 6;

const POPULAR_SEARCH = [
  "Frontend Developer",
  "UI/UX Designer",
  "Data Analyst",
  "AI Engineer",
];

// ── MAIN PAGE ─────────────────────────────────────
export default function JobsPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] =
    useState("");

  const [lokasi, setLokasi] =
    useState("Semua Lokasi");

  const [kategori, setKategori] =
    useState("Semua Kategori");

  const [currentPage, setCurrentPage] =
    useState(1);

  // ── SAVED JOBS ───────────────────────────
  const [savedJobs, setSavedJobs] =
    useState(() => {
      const existing =
        localStorage.getItem("savedJobs");

      return existing
        ? JSON.parse(existing)
        : [];
    });

  // ── SAVE JOB ─────────────────────────────
  const handleSaveJob = (e, job) => {
    e.stopPropagation();

    const isSaved = savedJobs.some(
      (item) => item.id === job.id
    );

    let updatedJobs;

    if (isSaved) {
      updatedJobs = savedJobs.filter(
        (item) => item.id !== job.id
      );
    } else {
      updatedJobs = [...savedJobs, job];
    }

    setSavedJobs(updatedJobs);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );
  };

  // ── FILTER ───────────────────────────────
  const filteredJobs = DUMMY_JOBS.filter(
    (job) => {
      const matchKeyword =
        job.judul
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        job.perusahaan
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          );

      const matchLokasi =
        lokasi === "Semua Lokasi" ||
        job.lokasi === lokasi;

      const matchKategori =
        kategori ===
          "Semua Kategori" ||
        job.kategori === kategori;

      return (
        matchKeyword &&
        matchLokasi &&
        matchKategori
      );
    }
  );

  // ── PAGINATION ───────────────────────────
  const totalPages = Math.ceil(
    filteredJobs.length /
      JOBS_PER_PAGE
  );

  const paginatedJobs =
    filteredJobs.slice(
      (currentPage - 1) *
        JOBS_PER_PAGE,
      currentPage * JOBS_PER_PAGE
    );

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Cari Lowongan Kerja
        </h1>

        <p className="text-gray-500 mt-2">
          Temukan pekerjaan terbaik
          sesuai skill dan minatmu
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

            <Search
              size={20}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
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
            onChange={(e) =>
              setLokasi(
                e.target.value
              )
            }
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
            <option>
              Semua Lokasi
            </option>

            <option>
              Jakarta
            </option>

            <option>
              Bandung
            </option>

            <option>
              Surabaya
            </option>

            <option>
              Remote
            </option>

            <option>Bali</option>

          </select>

          {/* KATEGORI */}
          <select
            value={kategori}
            onChange={(e) =>
              setKategori(
                e.target.value
              )
            }
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
            <option>
              Semua Kategori
            </option>

            <option>
              Data
            </option>

            <option>
              IT
            </option>

            <option>
              Design
            </option>

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
              onClick={() =>
                setKeyword(item)
              }
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
          Menampilkan{" "}
          <span className="font-bold text-gray-800">
            {filteredJobs.length}
          </span>{" "}
          lowongan pekerjaan
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

        {paginatedJobs.map((job) => {
          const isSaved =
            savedJobs.some(
              (item) =>
                item.id === job.id
            );

          return (
            <div
              key={job.id}
              onClick={() =>
                navigate(
                  `/jobs/${job.id}`
                )
              }
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
                  <Briefcase
                    size={24}
                    className="text-[#8B1A1A]"
                  />
                </div>

                {/* SAVE */}
                <button
                  onClick={(e) =>
                    handleSaveJob(
                      e,
                      job
                    )
                  }
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
                    fill={
                      isSaved
                        ? "currentColor"
                        : "none"
                    }
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
      {filteredJobs.length === 0 && (
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
            Lowongan tidak ditemukan
          </h3>

          <p className="text-gray-500 mt-2">
            Coba gunakan kata kunci lain
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
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
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
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
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