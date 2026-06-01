import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ fixed = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState("ID");

  const menus = [
    { name: "Beranda", path: "/" },
    { name: "Cari Loker", path: "/jobs" },
    { name: "Analisis CV", path: "/analysis" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        w-full z-50 transition-all duration-500
        ${fixed ? "fixed top-0 left-0" : "relative"}
      `}
    >
      <div
        className={`
          transition-all duration-500 ease-in-out
          flex items-center justify-between
          px-6 md:px-10 mx-auto
          ${
            fixed && isScrolled
              ? "w-[90%] md:w-[85%] mt-4 bg-white/90 backdrop-blur-lg rounded-[30px] h-16 shadow-xl border border-gray-100"
              : "w-full bg-white h-20 border-b border-gray-100"
          }
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-14 w-auto cursor-pointer object-contain"
            onClick={() => navigate("/")}
          />

          {/* MENU */}
          <div className="hidden md:flex gap-1">
            {menus.map((menu) => (
              <button
                key={menu.name}
                onClick={() => navigate(menu.path)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  location.pathname === menu.path
                    ? "text-[#8B1A1A] bg-[#FDF2F2]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {menu.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* LANGUAGE */}
          <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold">
            <button
              onClick={() => setLang("ID")}
              className={`transition-colors ${
                lang === "ID"
                  ? "text-[#8B1A1A]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              ID
            </button>

            <span className="text-gray-300">|</span>

            <button
              onClick={() => setLang("EN")}
              className={`transition-colors ${
                lang === "EN"
                  ? "text-[#8B1A1A]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              EN
            </button>
          </div>

          {/* AUTH */}
          <div className="flex items-center bg-gray-100 p-1 rounded-full relative w-36 h-9">

            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 shadow-sm ${
                location.pathname === "/register"
                  ? "left-[calc(50%+2px)]"
                  : "left-1"
              }`}
            />

            <button
              onClick={() => navigate("/login")}
              className={`flex-1 z-10 text-[12px] font-bold transition-colors ${
                location.pathname === "/login"
                  ? "text-[#8B1A1A]"
                  : "text-gray-500"
              }`}
            >
              Masuk
            </button>

            <button
              onClick={() => navigate("/register")}
              className={`flex-1 z-10 text-[12px] font-bold transition-colors ${
                location.pathname === "/register"
                  ? "text-[#8B1A1A]"
                  : "text-gray-500"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* PROFILE */}
          <button className="text-gray-400 hover:text-[#8B1A1A] transition-colors">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.963-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}