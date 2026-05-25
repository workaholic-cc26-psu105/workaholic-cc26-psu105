import { useCallback, useEffect, useState } from "react";

import {
  Bookmark,
  MapPin,
  Briefcase,
  Trash2,
  Clock3,
  GraduationCap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function SavedPage() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSavedJobs = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");

      const result = await apiRequest("/user/saved-jobs");

      setSavedJobs(result.data || []);
    } catch (error) {
      setErrorMsg(error.message);
      setSavedJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSavedJobs();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchSavedJobs]);

  const removeJob = async (id) => {
    try {
      await apiRequest(`/user/saved-jobs/${id}`, {
        method: "DELETE",
      });

      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Lowongan Tersimpan
        </h1>

        <p className="text-gray-500 mt-2">
          Semua pekerjaan yang kamu simpan akan muncul di sini
        </p>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Memuat lowongan tersimpan...
          </h2>
        </div>
      )}

      {/* ERROR */}
      {!isLoading && errorMsg && (
        <div className="bg-white rounded-[32px] border border-red-100 p-16 text-center">
          <h2 className="text-xl font-bold text-red-500">
            {errorMsg}
          </h2>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !errorMsg && savedJobs.length === 0 && (
        <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#FDF2F2] flex items-center justify-center mx-auto mb-6">
            <Bookmark size={36} className="text-[#8B1A1A]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Belum ada lowongan tersimpan
          </h2>

          <p className="text-gray-500 mt-3">
            Simpan pekerjaan favoritmu agar lebih mudah ditemukan.
          </p>
        </div>
      )}

      {/* GRID */}
      {!isLoading && !errorMsg && savedJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center">
                  <Briefcase size={24} className="text-[#8B1A1A]" />
                </div>

                {/* SAVED ICON */}
                <div className="w-11 h-11 rounded-2xl bg-[#8B1A1A] text-white flex items-center justify-center">
                  <Bookmark size={18} fill="currentColor" />
                </div>
              </div>

              {/* CONTENT */}
              <div className="mt-6">
                {/* BADGES */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#FDF2F2] text-[#8B1A1A] text-xs font-bold">
                    {job.tipe}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {job.kategori}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-extrabold text-gray-900">
                  {job.judul}
                </h2>

                {/* COMPANY */}
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

              {/* ACTION */}
              <div className="flex gap-3 mt-7">
                {/* DETAIL */}
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="flex-1 bg-[#8B1A1A] hover:bg-[#701515] text-white py-3 rounded-2xl font-bold transition-all"
                >
                  Lihat Detail
                </button>

                {/* REMOVE */}
                <button
                  onClick={() => removeJob(job.id)}
                  className="w-14 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}