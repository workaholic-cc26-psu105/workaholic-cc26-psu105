import { useState } from "react";

import {
  ArrowLeft,
  MapPin,
  Building2,
  BriefcaseBusiness,
  Wallet,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "PT Teknologi Nusantara",
    location: "Jakarta",
    salary: "Rp 5jt - 8jt",
    type: "Full Time",
  },

  {
    id: 2,
    title: "UI/UX Designer",
    company: "Startup Inovasi",
    location: "Bandung",
    salary: "Rp 4jt - 7jt",
    type: "Remote",
  },

  {
    id: 3,
    title: "React Developer",
    company: "Digital Creative",
    location: "Remote",
    salary: "Rp 6jt - 10jt",
    type: "Hybrid",
  },
];

export default function JobDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [activeTab, setActiveTab] =
    useState("deskripsi");

  const job = JOBS.find(
    (item) => item.id === Number(id)
  );

  // JIKA JOB TIDAK ADA
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-black text-gray-900">
            Lowongan tidak ditemukan
          </h1>

          <button
            onClick={() =>
              navigate("/jobs")
            }
            className="
              mt-6
              bg-[#8B1A1A]
              text-white
              px-6 py-3
              rounded-2xl
              font-bold
            "
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-6 py-8">

      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <button
          onClick={() =>
            navigate(-1)
          }
          className="
            flex items-center gap-2
            text-gray-500
            hover:text-[#8B1A1A]
            transition-all
            mb-6
            font-semibold
          "
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        {/* HERO */}
        <section
          className="
            bg-gradient-to-br
            from-[#8B1A1A]
            to-[#B03030]
            rounded-[36px]
            p-8 md:p-10
            text-white
            relative
            overflow-hidden
            mb-6
          "
        >

          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
              <BriefcaseBusiness size={14} />
              Lowongan Terpilih
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              {job.title}
            </h1>

            <p className="text-white/80 mt-4 text-lg font-medium">
              {job.company}
            </p>

            {/* INFO */}
            <div className="flex flex-wrap gap-3 mt-8">

              <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <MapPin size={18} />
                <span className="font-semibold text-sm">
                  {job.location}
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <Wallet size={18} />
                <span className="font-semibold text-sm">
                  {job.salary}
                </span>
              </div>

              <div className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <Building2 size={18} />
                <span className="font-semibold text-sm">
                  {job.type}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* DESKRIPSI & PERUSAHAAN */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-6">

          {/* TAB */}
          <div className="flex border-b border-gray-100">

            <button
              onClick={() =>
                setActiveTab("deskripsi")
              }
              className={`flex-1 py-5 font-bold text-sm transition-all ${
                activeTab === "deskripsi"
                  ? "text-[#8B1A1A] border-b-2 border-[#8B1A1A]"
                  : "text-gray-400"
              }`}
            >
              Deskripsi Lowongan
            </button>

            <button
              onClick={() =>
                setActiveTab("perusahaan")
              }
              className={`flex-1 py-5 font-bold text-sm transition-all ${
                activeTab === "perusahaan"
                  ? "text-[#8B1A1A] border-b-2 border-[#8B1A1A]"
                  : "text-gray-400"
              }`}
            >
              Perusahaan
            </button>

          </div>

          {/* CONTENT */}
          <div className="p-8">

            {/* DESKRIPSI */}
            {activeTab ===
              "deskripsi" && (
              <div className="space-y-8">

                {/* PENDIDIKAN */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">
                    Pendidikan
                  </h3>

                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                    <p>
                      Minimal S1 Teknik
                      Informatika,
                      Sistem Informasi,
                      atau bidang terkait
                    </p>

                    <p>
                      Memahami dasar
                      frontend development
                    </p>

                    <p>
                      Memiliki kemampuan
                      komunikasi yang baik
                    </p>
                  </div>
                </div>

                {/* RINCIAN */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">
                    Rincian Lowongan
                  </h3>

                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                    <p>
                      • Mengembangkan
                      tampilan website
                      modern
                    </p>

                    <p>
                      • Bekerja sama
                      dengan UI/UX
                      Designer
                    </p>

                    <p>
                      • Maintenance dan
                      optimasi website
                    </p>

                    <p>
                      • Menggunakan React
                      & Tailwind CSS
                    </p>

                    <p>
                      • Memastikan
                      website responsive
                    </p>
                  </div>
                </div>

                {/* INFORMASI */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">
                    Informasi Singkat
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-[#F8F8F8] rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-2">
                        Tipe Kerja
                      </p>

                      <h4 className="font-bold text-gray-900">
                        Full Time
                      </h4>
                    </div>

                    <div className="bg-[#F8F8F8] rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-2">
                        Pengalaman
                      </p>

                      <h4 className="font-bold text-gray-900">
                        1 - 2 Tahun
                      </h4>
                    </div>

                    <div className="bg-[#F8F8F8] rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-2">
                        Lokasi
                      </p>

                      <h4 className="font-bold text-gray-900">
                        Jakarta
                      </h4>
                    </div>

                    <div className="bg-[#F8F8F8] rounded-2xl p-4">
                      <p className="text-xs text-gray-400 mb-2">
                        Level
                      </p>

                      <h4 className="font-bold text-gray-900">
                        Junior Level
                      </h4>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* PERUSAHAAN */}
            {activeTab ===
              "perusahaan" && (
              <div className="space-y-6">

                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">
                    Tentang Perusahaan
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    PT Teknologi
                    Nusantara merupakan
                    perusahaan digital
                    yang bergerak di
                    bidang pengembangan
                    software, website,
                    dan solusi teknologi
                    modern untuk berbagai
                    kebutuhan bisnis.
                  </p>
                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Website
                    </p>

                    <a
                      href="https://workaholic.id"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8B1A1A] font-semibold hover:underline"
                    >
                      https://workaholic.id
                    </a>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Industri
                    </p>

                    <p className="font-semibold text-gray-900">
                      Technology &
                      Software
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Jumlah Karyawan
                    </p>

                    <p className="font-semibold text-gray-900">
                      100 - 250
                      Karyawan
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ESTIMASI GAJI */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-7">

          <p className="text-sm text-gray-400 mb-2">
            Estimasi Gaji
          </p>

          <h2 className="text-3xl font-black text-[#8B1A1A]">
            {job.salary}
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Tipe Kerja
              </span>

              <span className="font-bold text-gray-900">
                Full Time
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Pengalaman
              </span>

              <span className="font-bold text-gray-900">
                Junior
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}