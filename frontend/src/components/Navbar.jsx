import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Navbar({
  fixed = false,
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  // DEFAULT USER
  const defaultUser = {
    nama: "Gravidya",
    email: "gravidya@email.com",
    avatar:
      "/profile-default.jpg",
  };

  const [user, setUser] =
    useState(defaultUser);

  const profileRef = useRef(null);

  const menus = [
    {
      name: "Beranda",
      path: "/",
    },

    {
      name: "Cari Loker",
      path: "/jobs",
    },

    {
      name: "Analisis CV",
      path: "/analysis",
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

  // LOAD PROFILE
  useEffect(() => {

    const loadProfile = () => {

      const savedUser =
        localStorage.getItem(
          "userProfile"
        );

      if (savedUser) {
        setUser(
          JSON.parse(savedUser)
        );
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

  // CLOSE DROPDOWN WHEN CLICK OUTSIDE
  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setShowProfileMenu(false);
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

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/");

    window.location.reload();
  };

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
        <div className="flex items-center gap-8">

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

          {/* PROFILE */}
          <div
            className="relative"
            ref={profileRef}
          >

            {/* PROFILE BUTTON */}
            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="
                w-11
                h-11
                rounded-full
                overflow-hidden
                border-2
                border-gray-200
                hover:border-[#8B1A1A]
                transition-all
              "
            >

              <img
                src={
                  user.avatar ||
                  "/profile-default.jpg"
                }
                alt="Profile"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            </button>

            {/* DROPDOWN */}
            {showProfileMenu && (

              <div className="
                absolute
                right-0
                mt-3
                w-52
                bg-white
                rounded-2xl
                shadow-2xl
                border
                border-gray-100
                overflow-hidden
                animate-in
                fade-in
                zoom-in-95
                duration-200
              ">

                {/* USER INFO */}
                <div className="
                  px-5
                  py-4
                  border-b
                  border-gray-100
                ">

                  <h3 className="
                    text-sm
                    font-bold
                    text-gray-900
                  ">
                    {user.nama}
                  </h3>

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    {user.email}
                  </p>

                </div>

                {/* MENU */}
                <div className="py-2">

                  {/* DASHBOARD */}
                  <button
                    onClick={() => {

                      navigate("/home");

                      setShowProfileMenu(
                        false
                      );
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-gray-700
                      hover:bg-[#FDF2F2]
                      hover:text-[#8B1A1A]
                      transition-all
                    "
                  >

                    {/* ICON */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3v18h18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17V9m4 8v-4m4 4V5"
                      />
                    </svg>

                    Dashboard

                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={
                      handleLogout
                    }
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-red-500
                      hover:bg-red-50
                      transition-all
                    "
                  >

                    {/* ICON */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 12H9m0 0l3-3m-3 3l3 3"
                      />
                    </svg>

                    Logout

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}