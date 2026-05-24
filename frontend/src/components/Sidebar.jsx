import {
  Home,
  Bookmark,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,      
  BriefcaseBusiness,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const MENU_ITEMS = [
  {
    name: "Home",
    icon: Home,
    path: "/home",
  },
  {
    name: "Cari Lowongan",       
    icon: BriefcaseBusiness,
    path: "/jobs",
  },
   {
    name: "Tersimpan",
    icon: Bookmark,
    path: "/saved",
  },
  {
    name: "Analisis CV",         
    icon: FileText,
    path: "/analysis",
  },
  {
    name: "Profil",
    icon: User,
    path: "/profile",
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <aside
      className={`
        ${collapsed ? "w-[80px]" : "w-64"}
        bg-white border-r border-gray-100
        flex flex-col justify-between
        transition-all duration-300
        shadow-sm
      `}
    >
      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="h-20 border-b border-gray-100 flex items-center justify-between px-4">

          {!collapsed && (
            <img
              src="/logo.png"
              alt="logo"
              className="h-10 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => navigate("/")}
            />
          )}

          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className={`
              w-9 h-9 rounded-xl
              hover:bg-gray-100
              flex items-center justify-center
              text-gray-500
              transition-all
              ${collapsed ? "mx-auto" : ""}
            `}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

        </div>

        {/* MENU */}
        <nav className="p-3 space-y-2 mt-3">

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() =>
                  navigate(item.path)
                }
                className={`
                  w-full flex items-center
                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-3 px-4"
                  }
                  py-3 rounded-2xl
                  text-sm font-semibold
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-[#8B1A1A] text-white shadow-md"
                      : "text-gray-500 hover:bg-[#FDF2F2] hover:text-[#8B1A1A]"
                  }
                `}
              >
                <Icon size={18} />

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </button>
            );
          })}

        </nav>
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-100">

        <button
          onClick={() =>
            navigate("/login")
          }
          className={`
            w-full flex items-center
            ${
              collapsed
                ? "justify-center"
                : "gap-3 px-4"
            }
            py-3 rounded-2xl
            text-sm font-semibold
            text-gray-500
            hover:bg-red-50
            hover:text-red-600
            transition-all
          `}
        >
          <LogOut size={18} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

      </div>
    </aside>
  );
}