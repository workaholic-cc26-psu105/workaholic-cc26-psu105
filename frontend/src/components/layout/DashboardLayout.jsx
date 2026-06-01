import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import BottomNav from "../BottomNav";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">

      {/* SIDEBAR — hanya tampil di desktop */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${isMobile ? "pb-24" : ""}`}>
          <Outlet />
        </main>

      </div>

      {/* BOTTOM NAV — hanya tampil di mobile */}
      {isMobile && <BottomNav />}

    </div>
  );
}