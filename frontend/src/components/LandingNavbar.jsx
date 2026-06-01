import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function LandingNavbar({
  fixed = false,
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const menus = [
    {
      name: "Beranda",
      path: "/",
    },

    {
      name: "Lowongan",
      path: "/jobs",
    },
  ];

  // SCROLL EFFECT
  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 50
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  // LOGO CLICK
  const handleLogoClick = () => {

    if (location.pathname === "/") {

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } else {

      navigate("/");

      setTimeout(() => {

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      }, 100);
    }
  };

  return (
    <nav
      className={`
        w-full
        z-50
        transition-all
        duration-500
        ${
          fixed
            ? "fixed top-0 left-0"
            : "relative"
        }
      `}
    >

      <div
        className={`
          transition-all
          duration-500
          ease-in-out
          flex
          items-center
          justify-between
          px-6
          md:px-10
          mx-auto
          ${
            fixed && isScrolled
              ? "w-[90%] md:w-[85%] mt-4 bg-white/90 backdrop-blur-lg rounded-[30px] h-16 shadow-xl border border-gray-100"
              : "w-full bg-white h-20 border-b border-gray-100"
          }
        `}
      >

        {/* LEFT */}
        <div className="
          flex
          items-center
          gap-8
        ">

          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Logo"
            className="
              h-14
              w-auto
              cursor-pointer
              object-contain
              hover:scale-105
              transition-all
              duration-300
            "
            onClick={handleLogoClick}
          />

          {/* MENU */}
          <div className="
            hidden
            md:flex
            gap-1
          ">

            {menus.map((menu) => (

              <button
                key={menu.name}
                onClick={() =>
                  navigate(menu.path)
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    location.pathname ===
                    menu.path
                      ? "text-[#8B1A1A] bg-[#FDF2F2]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {menu.name}
              </button>

            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="
          flex
          items-center
          gap-6
        ">

          {/* AUTH */}
          <div className="
            flex
            items-center
            bg-gray-100
            p-1
            rounded-full
            relative
            w-36
            h-9
          ">

            {/* ACTIVE BACKGROUND */}
            <div
              className={`
                absolute
                top-1
                bottom-1
                w-[calc(50%-4px)]
                bg-white
                rounded-full
                transition-all
                duration-300
                shadow-sm
                ${
                  location.pathname ===
                  "/register"
                    ? "left-[calc(50%+2px)]"
                    : "left-1"
                }
              `}
            />

            {/* LOGIN */}
            <button
              onClick={() =>
                navigate("/login")
              }
              className={`
                flex-1
                z-10
                text-[12px]
                font-bold
                transition-colors
                ${
                  location.pathname ===
                  "/login"
                    ? "text-[#8B1A1A]"
                    : "text-gray-500"
                }
              `}
            >
              Masuk
            </button>

            {/* REGISTER */}
            <button
              onClick={() =>
                navigate("/register")
              }
              className={`
                flex-1
                z-10
                text-[12px]
                font-bold
                transition-colors
                ${
                  location.pathname ===
                  "/register"
                    ? "text-[#8B1A1A]"
                    : "text-gray-500"
                }
              `}
            >
              Daftar
            </button>

          </div>

        </div>

      </div>

    </nav>
  );
}