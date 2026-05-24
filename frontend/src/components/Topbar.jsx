import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Search,
} from "lucide-react";

export default function Topbar() {

  // ─────────────────────────────────────────────
  // DEFAULT USER
  // ─────────────────────────────────────────────
  const defaultUser = {
    nama: "Gravidya",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/300?img=12",
  };

  // ─────────────────────────────────────────────
  // DATA DUMMY NOTIFICATION
  // ─────────────────────────────────────────────
  const defaultNotifications = [
    {
      id: 1,
      title: "CV berhasil dianalisis",
      time: "Baru saja",
      read: false,
    },

    {
      id: 2,
      title: "3 lowongan baru cocok untukmu",
      time: "10 menit lalu",
      read: false,
    },

    {
      id: 3,
      title: "Profile berhasil diperbarui",
      time: "1 jam lalu",
      read: true,
    },
  ];

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [user, setUser] =
    useState(defaultUser);

  const [showNotif, setShowNotif] =
    useState(false);

  const [notifications, setNotifications] =
    useState(defaultNotifications);

  const notifRef = useRef(null);

  // ─────────────────────────────────────────────
  // LOAD PROFILE
  // ─────────────────────────────────────────────
  useEffect(() => {

    const loadProfile = () => {

      const savedUser =
        localStorage.getItem("userProfile");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

    };

    loadProfile();

    window.addEventListener(
      "profileUpdated",
      loadProfile
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        loadProfile
      );
    };

  }, []);

  // ─────────────────────────────────────────────
  // LOAD NOTIFICATION
  // ─────────────────────────────────────────────
  useEffect(() => {

    const savedNotif =
      localStorage.getItem("notifications");

    if (savedNotif) {
      setNotifications(
        JSON.parse(savedNotif)
      );
    } else {
      localStorage.setItem(
        "notifications",
        JSON.stringify(defaultNotifications)
      );
    }

  }, []);

  // ─────────────────────────────────────────────
  // CLOSE DROPDOWN CLICK OUTSIDE
  // ─────────────────────────────────────────────
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotif(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // ─────────────────────────────────────────────
  // UNREAD COUNT
  // ─────────────────────────────────────────────
  const unreadCount =
    notifications.filter(
      (notif) => !notif.read
    ).length;

  // ─────────────────────────────────────────────
  // OPEN NOTIFICATION
  // ─────────────────────────────────────────────
  const toggleNotif = () => {

    setShowNotif(!showNotif);

    // mark all read
    const updated =
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }));

    setNotifications(updated);

    localStorage.setItem(
      "notifications",
      JSON.stringify(updated)
    );

  };

  return (
    <header
      className="
        h-20
        bg-white
        border-b border-gray-100
        px-6
        flex items-center justify-between
      "
    >

      {/* SEARCH */}
      <div
        className="
          hidden md:flex
          items-center
          gap-3
          bg-[#F7F7F7]
          px-4 py-3
          rounded-2xl
          w-[320px]
        "
      >

        <Search
          size={18}
          className="text-gray-400"
        />

        <input
          type="text"
          placeholder="Cari pekerjaan..."
          className="
            bg-transparent
            outline-none
            text-sm
            w-full
          "
        />

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 ml-auto">

        {/* NOTIFICATION */}
        <div
          className="relative"
          ref={notifRef}
        >

          <button
            onClick={toggleNotif}
            className="
              relative
              w-12 h-12
              rounded-2xl
              bg-[#F7F7F7]
              flex items-center justify-center
              hover:bg-[#F1F1F1]
              transition-all
            "
          >

            <Bell
              size={20}
              className="text-gray-600"
            />

            {unreadCount > 0 && (
              <div
                className="
                  absolute -top-1 -right-1
                  min-w-[20px]
                  h-5
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                  flex items-center justify-center
                "
              >
                {unreadCount}
              </div>
            )}

          </button>

          {/* DROPDOWN */}
          {showNotif && (

            <div
              className="
                absolute right-0 top-16
                w-[340px]
                bg-white
                rounded-3xl
                border border-gray-100
                shadow-xl
                overflow-hidden
                z-50
              "
            >

              {/* HEADER */}
              <div className="p-5 border-b border-gray-100">

                <h3 className="font-black text-lg text-gray-900">
                  Notifikasi
                </h3>

              </div>

              {/* LIST */}
              <div className="max-h-[350px] overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="p-8 text-center">

                    <Bell
                      size={36}
                      className="mx-auto text-gray-300 mb-3"
                    />

                    <p className="text-sm text-gray-400">
                      Tidak ada notifikasi
                    </p>

                  </div>

                ) : (

                  notifications.map((notif) => (

                    <div
                      key={notif.id}
                      className="
                        px-5 py-4
                        border-b border-gray-50
                        hover:bg-gray-50
                        transition-all
                      "
                    >

                      <div className="flex items-start gap-3">

                        <div
                          className={`
                            mt-1
                            w-2 h-2
                            rounded-full
                            ${
                              notif.read
                                ? "bg-gray-300"
                                : "bg-red-500"
                            }
                          `}
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
        <div
          className="
            flex items-center gap-3
            bg-[#F7F7F7]
            px-3 py-2
            rounded-2xl
          "
        >

          <img
            src={user.avatar}
            alt="profile"
            className="
              w-11 h-11
              rounded-xl
              object-cover
            "
          />

          <div className="hidden md:block">

            <h4
              className="
                text-sm
                font-bold
                text-gray-900
                leading-none
              "
            >
              {user.nama}
            </h4>

            <p
              className="
                text-xs
                text-gray-500
                mt-1
              "
            >
              {user.role}
            </p>

          </div>

        </div>

      </div>
    </header>
  );
}