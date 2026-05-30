import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Bell, Search, LogOut } from "lucide-react";

import { apiRequest } from "../services/api";

const DEFAULT_USER = {
  nama: "User",
  role: "Fresh Graduate",
  avatar: "https://i.pravatar.cc/300?img=12",
};

const DUMMY_NOTIFICATION_TITLES = [
  "CV berhasil dianalisis",
  "3 lowongan baru cocok untukmu",
  "Profile berhasil diperbarui",
];

const safeJsonParse = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getRealNotifications = () => {
  const savedNotif = localStorage.getItem("notifications");
  const parsedNotif = safeJsonParse(savedNotif, []);

  if (!Array.isArray(parsedNotif)) {
    return [];
  }

  return parsedNotif.filter(
    (notif) => !DUMMY_NOTIFICATION_TITLES.includes(notif.title)
  );
};

export default function Topbar() {
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const [user, setUser] = useState(DEFAULT_USER);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(() => {
    const realNotifications = getRealNotifications();

    setNotifications(realNotifications);
    localStorage.setItem("notifications", JSON.stringify(realNotifications));
  }, []);

  const loadProfile = useCallback(async () => {
    const savedUser = localStorage.getItem("userProfile");

    if (savedUser) {
      setUser({
        ...DEFAULT_USER,
        ...JSON.parse(savedUser),
      });
    }

    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const result = await apiRequest("/user/profile");

      setUser({
        ...DEFAULT_USER,
        ...result.data,
        avatar: result.data.avatar || DEFAULT_USER.avatar,
      });

      localStorage.setItem("userProfile", JSON.stringify(result.data));
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProfile();
      loadNotifications();
    }, 0);

    window.addEventListener("profileUpdated", loadProfile);
    window.addEventListener("notificationsUpdated", loadNotifications);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener("notificationsUpdated", loadNotifications);
    };
  }, [loadProfile, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const toggleNotif = () => {
    setShowNotif((prev) => !prev);

    const updated = notifications.map((notif) => ({
      ...notif,
      read: true,
    }));

    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const keyword = searchKeyword.trim();

    if (!keyword) {
      navigate("/jobs");
      return;
    }

    navigate(`/jobs?q=${encodeURIComponent(keyword)}`);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchKeyword.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("selectedCVReview");
    localStorage.removeItem("hasAnalysis");

    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between">
      {/* SEARCH */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center gap-3 bg-[#F7F7F7] px-4 py-3 rounded-2xl w-[320px]"
      >
        <Search size={18} className="text-gray-400" />

        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Cari pekerjaan..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </form>

      {/* RIGHT */}
      <div className="flex items-center gap-4 ml-auto">
        {/* NOTIFICATION */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className="relative w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center hover:bg-[#F1F1F1] transition-all"
          >
            <Bell size={20} className="text-gray-600" />

            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 top-16 w-[340px] bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden z-50">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-black text-lg text-gray-900">
                  Notifikasi
                </h3>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={36} className="mx-auto text-gray-300 mb-3" />

                    <p className="text-sm text-gray-400">
                      Belum ada notifikasi
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-2 h-2 rounded-full ${
                            notif.read ? "bg-gray-300" : "bg-red-500"
                          }`}
                        />

                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800 leading-relaxed">
                            {notif.title}
                          </h4>

                          <p className="text-xs text-gray-400 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 bg-[#F7F7F7] px-3 py-2 rounded-2xl">
          <img
            src={user.avatar || DEFAULT_USER.avatar}
            alt="profile"
            className="w-11 h-11 rounded-xl object-cover"
          />

          <div className="hidden md:block">
            <h4 className="text-sm font-bold text-gray-900 leading-none">
              {user.nama || "User"}
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              {user.role || "Fresh Graduate"}
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}