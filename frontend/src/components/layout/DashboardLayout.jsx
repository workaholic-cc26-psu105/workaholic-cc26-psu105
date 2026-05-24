import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}