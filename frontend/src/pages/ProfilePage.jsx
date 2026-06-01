import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { addNotification } from "../utils/notification";

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

const DEFAULT_USER = {
  nama: "User",
  email: "",
  phone: "",
  location: "",
  role: "Fresh Graduate",
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

const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

const normalizeProfile = (profile) => {
  if (!profile) return DEFAULT_USER;

  return {
    ...DEFAULT_USER,
    ...profile,
    nama: profile.nama || profile.name || DEFAULT_USER.nama,
    email: profile.email || DEFAULT_USER.email,
    phone: profile.phone || DEFAULT_USER.phone,
    location: profile.location || DEFAULT_USER.location,
    role: profile.role || DEFAULT_USER.role,
    education: profile.education || DEFAULT_USER.education,
    bio: profile.bio || DEFAULT_USER.bio,
    avatar: profile.avatar || profile.avatar_url || DEFAULT_USER.avatar,
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    stats: {
      ...DEFAULT_USER.stats,
      ...(profile.stats || {}),
    },
  };
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(DEFAULT_USER);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

const loadProfile = useCallback(async () => {
  try {
    const savedUser = safeJsonParse(localStorage.getItem("userProfile"));

    if (savedUser) {
      setUser(normalizeProfile(savedUser));
    }

    const result = await apiRequest("/user/profile");
    const apiProfile = normalizeProfile(result?.data || result);

    const mergedProfile = {
      ...apiProfile,
      avatar: apiProfile.avatar || savedUser?.avatar || DEFAULT_USER.avatar,
    };

    setUser(mergedProfile);
    localStorage.setItem("userProfile", JSON.stringify(mergedProfile));

    window.dispatchEvent(new Event("profileUpdated"));
  } catch (error) {
    console.log("Gagal memuat profile:", error.message);
  }
}, []);

  const loadHistory = useCallback(async () => {
    try {
      const result = await apiRequest("/cv/history");

      const histories = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      setAnalysisHistory(histories);
      localStorage.setItem("cvAnalysisHistory", JSON.stringify(histories));
    } catch {
      const localHistories = safeJsonParse(
        localStorage.getItem("cvAnalysisHistory"),
        []
      );

      setAnalysisHistory(Array.isArray(localHistories) ? localHistories : []);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      await Promise.all([loadProfile(), loadHistory()]);

      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadProfile, loadHistory]);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handlePhotoChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File avatar harus berupa gambar.");
    e.target.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Ukuran gambar maksimal 2MB.");
    e.target.value = "";
    return;
  }

  try {
    setIsUploadingAvatar(true);

    const avatarBase64 = await fileToBase64(file);

    const updatedProfile = {
      ...user,
      avatar: avatarBase64,
    };

    setUser(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    await apiRequest("/user/profile", {
      method: "PUT",
      body: JSON.stringify({
        nama: updatedProfile.nama,
        phone: updatedProfile.phone,
        location: updatedProfile.location,
        role: updatedProfile.role,
        education: updatedProfile.education,
        bio: updatedProfile.bio,
        skills: updatedProfile.skills,
        avatar: updatedProfile.avatar,
      }),
    });

    window.dispatchEvent(new Event("profileUpdated"));
    addNotification("Avatar profil berhasil diperbarui");

    alert("Avatar profil berhasil diperbarui");
  } catch (error) {
    alert(error.message || "Gagal memperbarui avatar profil.");

    await loadProfile();
  } finally {
    setIsUploadingAvatar(false);
    e.target.value = "";
  }
};

  const handleSave = async () => {
    try {
      setIsSaving(true);

  const payload = {
    nama: user.nama,
    phone: user.phone,
    location: user.location,
    role: user.role,
    education: user.education,
    bio: user.bio,
    skills: user.skills,
    avatar: user.avatar,
  };

      const result = await apiRequest("/user/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const apiProfile = normalizeProfile(result?.data || result);

      const updatedProfile = {
        ...apiProfile,
        avatar: user.avatar || apiProfile.avatar || DEFAULT_USER.avatar,
      };

      setUser(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      window.dispatchEvent(new Event("profileUpdated"));
      addNotification("Profil berhasil diperbarui");

      alert("Profile berhasil diperbarui");
    } catch (error) {
      alert(error.message || "Gagal memperbarui profile.");
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

      const updatedHistory = analysisHistory.filter((item) => item.id !== id);

      setAnalysisHistory(updatedHistory);
      localStorage.setItem("cvAnalysisHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      alert(error.message || "Gagal menghapus riwayat analisis CV.");
    }
  };

  const handleViewHistory = (item) => {
    localStorage.setItem("selectedCVReview", JSON.stringify(item));
    localStorage.setItem("cvAnalysisResult", JSON.stringify(item));

    navigate("/review");
  };

  const atsScore =
    user.stats?.ats_score || user.ats_score || user.skor || user.atsScore || 0;

  const appliedCount = user.stats?.applied_count || 0;
  const savedJobsCount = user.stats?.saved_jobs_count || 0;
  const cvAnalysisCount =
    user.stats?.cv_analysis_count || analysisHistory.length || 0;

  return (
    <div className="p-6 md:p-8 bg-[#F6F6F6] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Profil Saya</h1>

        <p className="text-gray-500 mt-1">
          Kelola informasi profil akun Workaholic kamu
        </p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-[#8B1A1A] to-[#B03030] relative">
          <div className="absolute left-8 bottom-[-50px]">
            <div className="relative">
              <img
                src={user.avatar || DEFAULT_USER.avatar}
                alt="avatar"
                className="
                  w-28 h-28
                  rounded-3xl
                  border-4 border-white
                  object-cover
                  shadow-lg
                "
              />

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
                <Camera size={18} className="text-[#8B1A1A]" />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-20 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {user.nama}
            </h2>

            <p className="text-[#8B1A1A] font-semibold mt-1">{user.role}</p>

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#FDF2F2] rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ATS Score</p>

                  <h3 className="text-2xl font-extrabold text-[#8B1A1A] mt-1">
                    {atsScore}%
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
                    {appliedCount}
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
                    {savedJobsCount}
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
                    {cvAnalysisCount}
                  </h3>
                </div>

                <FileText className="text-green-700" />
              </div>
            </div>
          </div>

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
              disabled
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
              icon={<BriefcaseBusiness size={18} />}
            />

            <InputField
              label="Pendidikan"
              name="education"
              value={user.education}
              onChange={handleChange}
              icon={<GraduationCap size={18} />}
            />
          </div>

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

          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Skills
            </label>

            <div className="flex flex-wrap gap-3">
              {(user.skills || []).length > 0 ? (
                user.skills.map((skill, index) => (
                  <div
                    key={`${skill}-${index}`}
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
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  Belum ada skill yang ditambahkan.
                </p>
              )}
            </div>
          </div>

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

            {isLoading ? (
              <div className="bg-[#FAFAFA] border border-dashed border-gray-200 rounded-[28px] p-10 text-center">
                <p className="text-sm text-gray-400">Memuat data profil...</p>
              </div>
            ) : analysisHistory.length === 0 ? (
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
                {analysisHistory.map((item, index) => (
                  <div
                    key={`${item.id || item.fileName || "history"}-${index}`}
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
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center shrink-0">
                          <FileText className="text-[#8B1A1A]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-extrabold text-gray-900 truncate">
                            {item.fileName || item.file_name || "CV"}
                          </h3>

                          <div className="flex flex-col gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full w-fit">
                              ATS Score {item.skor || item.ats_score || 0}%
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full w-fit">
                              {item.kecocokanUtama ||
                                item.kecocokan_utama ||
                                "-"}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full w-fit">
                              <CalendarDays size={12} />
                              {item.date || "Baru saja"}
                            </span>
                          </div>
                        </div>
                      </div>

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
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="
                flex items-center gap-2
                bg-[#8B1A1A]
                hover:bg-[#701515]
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                px-6 py-3
                rounded-2xl
                font-semibold
                transition-all
                shadow-md
              "
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

function InputField({ label, icon, name, value, onChange, disabled = false }) {
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
          value={value || ""}
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
            disabled:cursor-not-allowed
            ${icon ? "pl-11" : "px-4"}
          `}
        />
      </div>
    </div>
  );
}