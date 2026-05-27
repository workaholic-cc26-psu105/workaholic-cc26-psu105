import { useCallback, useEffect, useState } from "react";
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

import { apiRequest } from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();

  const defaultUser = {
    nama: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    education: "",
    bio: "",
    avatar: "https://i.pravatar.cc/300?img=12",
    skills: [],
    stats: {
      saved_jobs_count: 0,
      applied_count: 0,
      cv_analysis_count: 0,
      ats_score: 0,
    },
  };

  const [user, setUser] = useState(defaultUser);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const result = await apiRequest("/user/profile");

      setUser({
        ...defaultUser,
        ...result.data,
        avatar: result.data.avatar || defaultUser.avatar,
        skills: result.data.skills || [],
        stats: result.data.stats || defaultUser.stats,
      });

      localStorage.setItem("userProfile", JSON.stringify(result.data));
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchAnalysisHistory = useCallback(async () => {
    try {
      const result = await apiRequest("/cv/history");
      setAnalysisHistory(result.data || []);
    } catch (error) {
      console.error(error.message);
      setAnalysisHistory([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProfile();
      fetchAnalysisHistory();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchProfile, fetchAnalysisHistory]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await apiRequest("/user/avatar", {
        method: "POST",
        body: formData,
      });

      setUser((prev) => ({
        ...prev,
        avatar: result.data.avatar_url,
      }));

      window.dispatchEvent(new Event("profileUpdated"));
      alert("Avatar berhasil diperbarui");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const result = await apiRequest("/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          nama: user.nama,
          phone: user.phone,
          location: user.location,
          role: user.role,
          education: user.education,
          bio: user.bio,
          skills: user.skills || [],
        }),
      });

      setUser((prev) => ({
        ...prev,
        ...result.data,
        avatar: result.data.avatar || prev.avatar,
        stats: prev.stats,
      }));

      localStorage.setItem("userProfile", JSON.stringify(result.data));
      window.dispatchEvent(new Event("profileUpdated"));

      alert("Profile berhasil diperbarui");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    const confirmDelete = window.confirm("Hapus riwayat analisis CV ini?");

    if (!confirmDelete) return;

    try {
      await apiRequest(`/cv/history/${id}`, {
        method: "DELETE",
      });

      setAnalysisHistory((prev) => prev.filter((item) => item.id !== id));
      await fetchProfile();
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
      <div className="p-6 md:p-8 bg-[#F6F6F6] min-h-screen">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Memuat profile...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#F6F6F6] min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Profil Saya
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola informasi profil akun Workaholic kamu
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
                className="w-28 h-28 rounded-3xl border-4 border-white object-cover shadow-lg"
              />

              {/* CAMERA */}
              <label className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                <Camera size={18} className="text-[#8B1A1A]" />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
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
              {user.nama || "Nama belum diisi"}
            </h2>

            <p className="text-[#8B1A1A] font-semibold mt-1">
              {user.role || "Role belum diisi"}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                Open to Work
              </span>

              <span className="px-3 py-1 bg-[#FDF2F2] text-[#8B1A1A] text-xs font-semibold rounded-full">
                Fresh Graduate
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#FDF2F2] rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ATS Score</p>

                  <h3 className="text-2xl font-extrabold text-[#8B1A1A] mt-1">
                    {user.stats?.ats_score || 0}%
                  </h3>
                </div>

                <Sparkles className="text-[#8B1A1A]" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Dilamar</p>

                  <h3 className="text-2xl font-extrabold text-blue-700 mt-1">
                    {user.stats?.applied_count || 0}
                  </h3>
                </div>

                <Briefcase className="text-blue-700" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tersimpan</p>

                  <h3 className="text-2xl font-extrabold text-yellow-700 mt-1">
                    {user.stats?.saved_jobs_count || 0}
                  </h3>
                </div>

                <BookmarkCheck className="text-yellow-700" />
              </div>
            </div>

            <div className="bg-green-50 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Analisis CV</p>

                  <h3 className="text-2xl font-extrabold text-green-700 mt-1">
                    {user.stats?.cv_analysis_count || 0}
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
              value={user.nama || ""}
              onChange={handleChange}
            />

            <InputField
              label="Email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              icon={<Mail size={18} />}
              disabled
            />

            <InputField
              label="Nomor Telepon"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              icon={<Phone size={18} />}
            />

            <InputField
              label="Lokasi"
              name="location"
              value={user.location || ""}
              onChange={handleChange}
              icon={<MapPin size={18} />}
            />

            <InputField
              label="Pekerjaan / Role"
              name="role"
              value={user.role || ""}
              onChange={handleChange}
              icon={<BriefcaseBusiness size={18} />}
            />

            <InputField
              label="Pendidikan"
              name="education"
              value={user.education || ""}
              onChange={handleChange}
              icon={<GraduationCap size={18} />}
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
              value={user.bio || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 resize-none"
            />
          </div>

          {/* SKILLS */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Skills
            </label>

            <div className="flex flex-wrap gap-3">
              {(user.skills || []).length === 0 ? (
                <p className="text-sm text-gray-400">
                  Belum ada skill yang ditambahkan
                </p>
              ) : (
                (user.skills || []).map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-2 rounded-2xl bg-[#FDF2F2] text-[#8B1A1A] text-sm font-semibold"
                  >
                    {skill}
                  </div>
                ))
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
                  Semua hasil analisis CV yang pernah dilakukan
                </p>
              </div>
            </div>

            {analysisHistory.length === 0 ? (
              <div className="bg-[#FAFAFA] border border-dashed border-gray-200 rounded-[28px] p-10 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#FDF2F2] flex items-center justify-center mx-auto mb-5">
                  <FileText className="text-[#8B1A1A]" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Belum ada riwayat analisis
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Upload dan analisis CV terlebih dahulu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAFAFA] border border-gray-100 rounded-[28px] p-5 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center shrink-0">
                          <FileText className="text-[#8B1A1A]" />
                        </div>

                        <div>
                          <h3 className="text-lg font-extrabold text-gray-900">
                            {item.file_name || "CV Analysis"}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                              ATS Score {item.ats_score || 0}%
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                              {item.kecocokan_utama || "Tidak disebutkan"}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                              <CalendarDays size={12} />
                              {item.date || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewHistory(item)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#8B1A1A] hover:bg-[#701515] text-white text-sm font-semibold transition-all"
                        >
                          <Eye size={16} />
                          Lihat
                        </button>

                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-all"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#701515] text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-md disabled:opacity-60"
            >
              <Save size={18} />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  name,
  value,
  onChange,
  disabled = false,
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
          disabled={disabled}
          className={`
            w-full
            rounded-2xl
            border border-gray-200
            py-3 pr-4
            outline-none
            focus:ring-2
            focus:ring-[#8B1A1A]/20
            disabled:bg-gray-100
            disabled:text-gray-400
            ${icon ? "pl-11" : "px-4"}
          `}
        />
      </div>
    </div>
  );
}