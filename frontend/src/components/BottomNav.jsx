import {
  Home,
  BriefcaseBusiness,
  Bookmark,
  FileText,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MENU_ITEMS = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Lowongan", icon: BriefcaseBusiness, path: "/jobs" },
  { name: "Tersimpan", icon: Bookmark, path: "/saved" },
  { name: "Analisis CV", icon: FileText, path: "/analysis" },
  { name: "Profil", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center gap-1
                px-3 py-2 rounded-2xl
                transition-all duration-200
                flex-1
                ${isActive
                  ? "text-[#8B1A1A]"
                  : "text-gray-400 hover:text-[#8B1A1A]"
                }
              `}
            >
              <div className={`
                p-1.5 rounded-xl transition-all
                ${isActive ? "bg-[#FDF2F2]" : ""}
              `}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-semibold leading-none">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}