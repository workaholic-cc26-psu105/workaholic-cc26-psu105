import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Camera,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  Save,
  Sparkles,
  Briefcase,
  BookmarkCheck,
  FileText,
  Trash2,
  CalendarDays,
  Eye,
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();

  // DEFAULT USER
  const defaultUser = {
    nama: "Gravidya",
    email: "gravidya@gmail.com",
    phone: "+62 812-3456-7890",
    location: "Kendari, Indonesia",
    role: "Frontend Developer",
    education:
      "Universitas Sains dan Teknologi",
    bio: "Passionate frontend developer yang fokus membangun website modern, responsive, dan user friendly.",
    avatar:
      "https://i.pravatar.cc/300?img=12",

    skills: [
      "React",
      "Tailwind",
      "Figma",
      "UI Design",
    ],
  };

  // USER STATE
  const [user, setUser] =
    useState(defaultUser);

  // JOB TERSIMPAN
  const [savedJobsCount, setSavedJobsCount] =
    useState(0);

  // HISTORY ANALYSIS
  const [analysisHistory, setAnalysisHistory] =
    useState([]);

  // LOAD DATA
  useEffect(() => {
    // LOAD PROFILE
    const savedUser =
      localStorage.getItem("userProfile");

    if (savedUser) {
      const parsedUser =
        JSON.parse(savedUser);

      setUser({
        ...defaultUser,
        ...parsedUser,
      });
    }

    // LOAD JOB TERSIMPAN
    const savedJobs =
      JSON.parse(
        localStorage.getItem("savedJobs")
      ) || [];

    setSavedJobsCount(
      Array.isArray(savedJobs)
        ? savedJobs.length
        : 0
    );

    // LOAD ANALYSIS HISTORY
    const histories =
      JSON.parse(
        localStorage.getItem(
          "cvAnalysisHistory"
        )
      ) || [];

    setAnalysisHistory(histories);
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE FOTO
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setUser({
        ...user,
        avatar: imageUrl,
      });
    }
  };

  // SAVE PROFILE
  const handleSave = () => {
    localStorage.setItem(
      "userProfile",
      JSON.stringify(user)
    );

    // UPDATE TOPBAR
    window.dispatchEvent(
      new Event("profileUpdated")
    );

    alert("Profile berhasil diperbarui");
  };

  // DELETE HISTORY
  const handleDeleteHistory = (id) => {
    const confirmDelete = window.confirm(
      "Hapus riwayat analisis CV ini?"
    );

    if (!confirmDelete) return;

    const updatedHistory =
      analysisHistory.filter(
        (item) => item.id !== id
      );

    setAnalysisHistory(updatedHistory);

    localStorage.setItem(
      "cvAnalysisHistory",
      JSON.stringify(updatedHistory)
    );
  };

  // VIEW HISTORY
  const handleViewHistory = (item) => {
    localStorage.setItem(
      "selectedCVReview",
      JSON.stringify(item)
    );

    navigate("/review");
  };

  return (
    <div className="p-6 md:p-8 bg-[#F6F6F6] min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Profil Saya
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola informasi profil akun
          Workaholic kamu
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* BANNER */}
        <div className="h-44 bg-gradient-to-r from-[#8B1A1A] to-[#B03030] relative">
          {/* FOTO */}
          <div className="absolute left-8 bottom-[-50px]">
            <div className="relative">
              <img
                src={user.avatar}
                alt="avatar"
                className="
                  w-28 h-28
                  rounded-3xl
                  border-4 border-white
                  object-cover
                  shadow-lg
                "
              />

              {/* CAMERA */}
              <label
                className="
                  absolute bottom-0 right-0
                  w-10 h-10
                  rounded-xl
                  bg-white
                  shadow-md
                  flex items-center justify-center
                  cursor-pointer
                  hover:bg-gray-100
                  transition-all
                "
              >
                <Camera
                  size={18}
                  className="text-[#8B1A1A]"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-20 p-8">
          {/* PROFILE */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {user.nama}
            </h2>

            <p className="text-[#8B1A1A] font-semibold mt-1">
              {user.role}
            </p>

            {/* BADGE */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className="
                  px-3 py-1
                  bg-green-50
                  text-green-700
                  text-xs font-semibold
                  rounded-full
                "
              >
                Open to Work
              </span>

              <span
                className="
                  px-3 py-1
                  bg-[#FDF2F2]
                  text-[#8B1A1A]
                  text-xs font-semibold
                  rounded-full
                "
              >
                Fresh Graduate
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* ATS */}
            <div className="bg-[#FDF2F2] rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    ATS Score
                  </p>

                  <h3 className="text-2xl font-extrabold text-[#8B1A1A] mt-1">
                    86%
                  </h3>
                </div>

                <Sparkles className="text-[#8B1A1A]" />
              </div>
            </div>

            {/* DILAMAR */}
            <div className="bg-blue-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Dilamar
                  </p>

                  <h3 className="text-2xl font-extrabold text-blue-700 mt-1">
                    12
                  </h3>
                </div>

                <Briefcase className="text-blue-700" />
              </div>
            </div>

            {/* TERSIMPAN */}
            <div className="bg-yellow-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Tersimpan
                  </p>

                  <h3 className="text-2xl font-extrabold text-yellow-700 mt-1">
                    {savedJobsCount}
                  </h3>
                </div>

                <BookmarkCheck className="text-yellow-700" />
              </div>
            </div>

            {/* HISTORY */}
            <div className="bg-green-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Analisis CV
                  </p>

                  <h3 className="text-2xl font-extrabold text-green-700 mt-1">
                    {analysisHistory.length}
                  </h3>
                </div>

                <FileText className="text-green-700" />
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nama Lengkap"
              name="nama"
              value={user.nama}
              onChange={handleChange}
            />

            <InputField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              icon={<Mail size={18} />}
            />

            <InputField
              label="Nomor Telepon"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              icon={<Phone size={18} />}
            />

            <InputField
              label="Lokasi"
              name="location"
              value={user.location}
              onChange={handleChange}
              icon={<MapPin size={18} />}
            />

            <InputField
              label="Pekerjaan / Role"
              name="role"
              value={user.role}
              onChange={handleChange}
              icon={
                <BriefcaseBusiness size={18} />
              }
            />

            <InputField
              label="Pendidikan"
              name="education"
              value={user.education}
              onChange={handleChange}
              icon={
                <GraduationCap size={18} />
              }
            />
          </div>

          {/* BIO */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Tentang Saya
            </label>

            <textarea
              rows="5"
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="
                w-full
                rounded-2xl
                border border-gray-200
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-[#8B1A1A]/20
                resize-none
              "
            />
          </div>

          {/* SKILLS */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Skills
            </label>

            <div className="flex flex-wrap gap-3">
              {(user.skills || []).map(
                (skill) => (
                  <div
                    key={skill}
                    className="
                      px-4 py-2
                      rounded-2xl
                      bg-[#FDF2F2]
                      text-[#8B1A1A]
                      text-sm font-semibold
                    "
                  >
                    {skill}
                  </div>
                )
              )}
            </div>
          </div>

          {/* HISTORY ANALYSIS */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Riwayat Analisis CV
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Semua hasil analisis CV
                  yang pernah dilakukan
                </p>
              </div>
            </div>

            {analysisHistory.length ===
            0 ? (
              <div className="bg-[#FAFAFA] border border-dashed border-gray-200 rounded-[28px] p-10 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#FDF2F2] flex items-center justify-center mx-auto mb-5">
                  <FileText className="text-[#8B1A1A]" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Belum ada riwayat analisis
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Upload dan analisis CV
                  terlebih dahulu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisHistory.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="
                        bg-[#FAFAFA]
                        border border-gray-100
                        rounded-[28px]
                        p-3 md:p-5
                        hover:shadow-md
                        transition-all
                      "
                    >
                      <div className="flex flex-col gap-4">
                        {/* LEFT */}
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center shrink-0">
                            <FileText className="text-[#8B1A1A]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-extrabold text-gray-900 truncate">
                                {item.fileName}
                            </h3>

                            <div className="flex flex-col gap-1.5 mt-2">
                               <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full w-fit">
                                 ATS Score {item.skor}%
                               </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                               {item.kecocokanUtama}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full w-fit">
                               <CalendarDays size={12} />
                                {item.date}
                            </span>
                          </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => handleViewHistory(item)}
                        className="
                         flex items-center justify-center gap-1
                         flex-1
                         px-3 py-2.5
                         rounded-2xl
                         bg-[#8B1A1A]
                         hover:bg-[#701515]
                         text-white
                         text-xs md:text-sm font-semibold
                         transition-all
                         "
                        >
                        <Eye size={14} />
                          Lihat
                      </button>

                       <button
                         onClick={() => handleDeleteHistory(item.id)}
                         className="
                          flex items-center justify-center gap-1
                          flex-1
                          px-3 py-2.5
                          rounded-2xl
                          bg-red-50
                          hover:bg-red-100
                          text-red-600
                          text-xs md:text-sm font-semibold
                          transition-all
                          "
                          >
                            <Trash2 size={16} />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              className="
                flex items-center gap-2
                bg-[#8B1A1A]
                hover:bg-[#701515]
                text-white
                px-6 py-3
                rounded-2xl
                font-semibold
                transition-all
                shadow-md
              "
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENT INPUT
function InputField({
  label,
  icon,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`
            w-full
            rounded-2xl
            border border-gray-200
            py-3 pr-4
            outline-none
            focus:ring-2
            focus:ring-[#8B1A1A]/20
            ${icon ? "pl-11" : "px-4"}
          `}
        />
      </div>
    </div>
  );
}