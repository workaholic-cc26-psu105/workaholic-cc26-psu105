import React, { useState, useEffect } from "react";

import LandingNavbar from "../components/LandingNavbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  BriefcaseBusiness,
  FileSearch,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

// ─────────────────────────────────────────────
// DATA 
// ─────────────────────────────────────────────
const features = [
  {
    title: "Rekomendasi Pekerjaan Pintar",
    desc: "Dapatkan lowongan kerja yang sesuai dengan skill dan minatmu.",
    src: "/search.png",
  },

  {
    title: "AI CV Review",
    desc: "Perbaiki CV kamu dengan saran otomatis agar lebih menarik bagi recruiter.",
    src: "/review.png",
  },

  {
    title: "Khusus Entry-Level",
    desc: "Dirancang khusus untuk fresh graduate tanpa pengalaman kerja.",
    src: "/Like.png",
  },
];

const howItWorksData = [
  {
    id: 1,
    desc: "Unggah CV kamu dalam format PDF dengan mudah.",
  },

  {
    id: 2,
    desc: "Sistem akan membaca dan menganalisis skill serta pengalamanmu.",
  },

  {
    id: 3,
    desc: "Temukan pekerjaan yang sesuai dengan profilmu secara otomatis.",
  },
];

const jobs = [
  {
    title: "Frontend Developer",
    company: "PT Teknologi Nusantara",
    salary: "Rp 5jt - 8jt",
    location: "Jakarta",
    match: "92%",
  },

  {
    title: "UI/UX Designer",
    company: "Startup Inovasi",
    salary: "Rp 4jt - 7jt",
    location: "Bandung",
    match: "89%",
  },

  {
    title: "React Developer",
    company: "Digital Creative",
    salary: "Rp 6jt - 10jt",
    location: "Remote",
    match: "95%",
  },
];

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
const Hero = ({ navigate }) => {
  return (
    <section className="pt-44 pb-24 bg-gradient-to-b from-white via-[#FDF2F2] to-[#F2D1D1] px-6 md:px-20 overflow-hidden relative">

      {/* BLUR */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#8B1A1A]/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B1A1A]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">

        {/* LEFT */}
        <div className="md:w-1/2 text-left">

          <div className="inline-flex items-center gap-2 bg-[#FDF2F2] border border-[#F2D1D1] text-[#8B1A1A] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            AI Career Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.15] mb-8 tracking-tight">
            Mulai Karier Pertama{" "}
            <br className="hidden lg:block" />
            dengan Lebih Pasti
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-lg leading-relaxed">
            Gunakan keunggulan AI untuk menganalisis CV dan temukan peluang kerja{" "}
            <span className="text-[#8B1A1A] font-semibold">
              entry-level
            </span>{" "}
            yang paling presisi dengan bakatmu
          </p>

          {/* BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/analysis")}
              className="px-10 py-4 bg-[#8B1A1A] text-white font-bold text-sm rounded-2xl shadow-[0_10px_20px_-5px_rgba(139,26,26,0.4)] hover:bg-[#701515] transition-all hover:-translate-y-1"
            >
              Upload CV Sekarang
            </button>

          </div>

          {/* STATS */}
          <div className="flex flex-wrap gap-6 mt-12">

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                1200+
              </h3>

              <p className="text-sm text-gray-500">
                CV Dianalisis
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                350+
              </h3>

              <p className="text-sm text-gray-500">
                Lowongan Aktif
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                89%
              </h3>

              <p className="text-sm text-gray-500">
                ATS Accuracy
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 flex justify-center relative">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 rounded-full blur-3xl -z-10"></div>

          <img
            src="/hero.png"
            alt="Hero"
            className="w-full max-w-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] object-contain"
          />

        </div>

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// TECHNOLOGY
// ─────────────────────────────────────────────
const TechnologySection = () => (
  <section className="bg-white py-10 border-y border-gray-100">

    <div className="max-w-6xl mx-auto px-6">

      <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-[0.2em] mb-8">
        Built With Modern Technology
      </p>

      <div className="flex flex-wrap items-center justify-center gap-10 text-gray-400 font-bold text-lg">

        <span>React</span>
        <span>Tailwind CSS</span>
        <span>Node.js</span>
        <span>Express</span>
        <span>AI</span>
        <span>PostgreSQL</span>

      </div>

    </div>

  </section>
);

// ─────────────────────────────────────────────
// FEATURES 
// ─────────────────────────────────────────────
const FeaturesSection = () => (
  <section className="bg-gradient-to-b from-[#F2D1D1] to-[#E9BDBD] py-28">

    <div className="max-w-5xl mx-auto px-6">

      {/* HEADER */}
      <div className="text-center mb-20">

        <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-[#8B1A1A] text-sm font-bold shadow-sm mb-6">
          <Sparkles size={16} />
          WHY WORKAHOLIC
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-[#8B1A1A] tracking-tight leading-tight">
          Fitur Unggulan
        </h2>

        <p className="text-gray-700 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
          Semua yang kamu butuhkan untuk memulai karier pertama
          dalam satu platform modern berbasis AI
        </p>

      </div>

      {/* FEATURES LIST */}
      <div className="space-y-8">

        {/* CARD 1 */}
        <div
          className="
            group
            bg-white
            rounded-[40px]
            p-10 md:p-12
            shadow-xl
            border border-white/70
            relative
            overflow-hidden
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_20px_50px_rgba(139,26,26,0.25)]
          "
        >

          {/* RED BACKGROUND */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-[#8B1A1A]
              to-[#B32626]
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-500
            "
          />

          {/* NUMBER */}
          <h1
            className="
              absolute top-6 right-8
              text-7xl font-black
              text-[#8B1A1A]/5
              group-hover:text-white/10
              transition-all
              duration-500
            "
          >
            01
          </h1>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">

            {/* ICON */}
            <div
              className="
                w-24 h-24 rounded-[30px]
                bg-[#FDF2F2]
                group-hover:bg-white/15
                flex items-center justify-center
                shrink-0
                transition-all duration-500
              "
            >

              <FileSearch
                size={42}
                className="
                  text-[#8B1A1A]
                  group-hover:text-white
                  transition-all duration-500
                "
              />

            </div>

            {/* TEXT */}
            <div>

              <div
                className="
                  inline-flex items-center gap-2
                  bg-[#FDF2F2]
                  group-hover:bg-white/15
                  text-[#8B1A1A]
                  group-hover:text-white
                  px-4 py-2 rounded-full
                  text-sm font-bold mb-5
                  transition-all duration-500
                "
              >
                AI Powered
              </div>

              <h3
                className="
                  text-3xl md:text-4xl font-black
                  text-gray-900
                  group-hover:text-white
                  mb-5
                  transition-all duration-500
                "
              >
                AI CV Review
              </h3>

              <p
                className="
                  text-gray-600
                  group-hover:text-white/85
                  text-lg leading-relaxed max-w-2xl
                  transition-all duration-500
                "
              >
                Analisis CV ATS Friendly secara otomatis dan dapatkan
                saran profesional untuk meningkatkan peluang diterima recruiter.
              </p>

            </div>

          </div>

        </div>

        {/* CARD 2 */}
        <div
          className="
            group
            bg-white
            rounded-[40px]
            p-10 md:p-12
            shadow-xl
            border border-white/70
            relative
            overflow-hidden
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_20px_50px_rgba(139,26,26,0.25)]
          "
        >

          {/* RED BACKGROUND */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-[#8B1A1A]
              to-[#B32626]
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-500
            "
          />

          {/* NUMBER */}
          <h1
            className="
              absolute top-6 right-8
              text-7xl font-black
              text-[#8B1A1A]/5
              group-hover:text-white/10
              transition-all duration-500
            "
          >
            02
          </h1>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">

            {/* ICON */}
            <div
              className="
                w-24 h-24 rounded-[30px]
                bg-[#FDF2F2]
                group-hover:bg-white/15
                flex items-center justify-center
                shrink-0
                transition-all duration-500
              "
            >

              <BriefcaseBusiness
                size={42}
                className="
                  text-[#8B1A1A]
                  group-hover:text-white
                  transition-all duration-500
                "
              />

            </div>

            {/* TEXT */}
            <div>

              <div
                className="
                  inline-flex items-center gap-2
                  bg-[#FDF2F2]
                  group-hover:bg-white/15
                  text-[#8B1A1A]
                  group-hover:text-white
                  px-4 py-2 rounded-full
                  text-sm font-bold mb-5
                  transition-all duration-500
                "
              >
                Smart Matching
              </div>

              <h3
                className="
                  text-3xl md:text-4xl font-black
                  text-gray-900
                  group-hover:text-white
                  mb-5
                  transition-all duration-500
                "
              >
                Rekomendasi Pekerjaan Pintar
              </h3>

              <p
                className="
                  text-gray-600
                  group-hover:text-white/85
                  text-lg leading-relaxed max-w-2xl
                  transition-all duration-500
                "
              >
                Temukan lowongan kerja yang sesuai dengan skill,
                minat, dan profil CV kamu secara otomatis menggunakan AI
              </p>

            </div>

          </div>

        </div>

        {/* CARD 3 */}
        <div
          className="
            group
            bg-white
            rounded-[40px]
            p-10 md:p-12
            shadow-xl
            border border-white/70
            relative
            overflow-hidden
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_20px_50px_rgba(139,26,26,0.25)]
          "
        >

          {/* RED BACKGROUND */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-[#8B1A1A]
              to-[#B32626]
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-500
            "
          />

          {/* NUMBER */}
          <h1
            className="
              absolute top-6 right-8
              text-7xl font-black
              text-[#8B1A1A]/5
              group-hover:text-white/10
              transition-all duration-500
            "
          >
            03
          </h1>

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">

            {/* ICON */}
            <div
              className="
                w-24 h-24 rounded-[30px]
                bg-[#FDF2F2]
                group-hover:bg-white/15
                flex items-center justify-center
                shrink-0
                transition-all duration-500
              "
            >

              <ShieldCheck
                size={42}
                className="
                  text-[#8B1A1A]
                  group-hover:text-white
                  transition-all duration-500
                "
              />

            </div>

            {/* TEXT */}
            <div>

              <div
                className="
                  inline-flex items-center gap-2
                  bg-[#FDF2F2]
                  group-hover:bg-white/15
                  text-[#8B1A1A]
                  group-hover:text-white
                  px-4 py-2 rounded-full
                  text-sm font-bold mb-5
                  transition-all duration-500
                "
              >
                Entry-Level Focus
              </div>

              <h3
                className="
                  text-3xl md:text-4xl font-black
                  text-gray-900
                  group-hover:text-white
                  mb-5
                  transition-all duration-500
                "
              >
                Khusus Fresh Graduate
              </h3>

              <p
                className="
                  text-gray-600
                  group-hover:text-white/85
                  text-lg leading-relaxed max-w-2xl
                  transition-all duration-500
                "
              >
                Dibangun khusus untuk fresh graduate dan job seeker
                tanpa pengalaman kerja profesional agar lebih siap memasuki dunia kerja
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
);

// ─────────────────────────────────────────────
// ABOUT US
// ─────────────────────────────────────────────
const AboutUs = () => (
  <section className="py-28 bg-white overflow-hidden">

    <div className="max-w-7xl mx-auto px-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* IMAGE */}
        <div className="relative flex justify-center">

          {/* BLUR */}
          <div className="
            absolute
            inset-0
            bg-[#8B1A1A]/10
            blur-3xl
            rounded-full
          "></div>

          {/* CARD */}
          <div className="
            relative
            z-10
            bg-white
            p-5
            rounded-[42px]
            shadow-[0_25px_80px_rgba(0,0,0,0.08)]
            border
            border-gray-100
            w-full
            max-w-[620px]
          ">

            {/* TOP BAR */}
            <div className="
              flex
              items-center
              gap-2
              mb-4
              px-2
            ">

              <div className="w-3 h-3 rounded-full bg-red-300"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
              <div className="w-3 h-3 rounded-full bg-green-300"></div>

            </div>

            {/* IMAGE */}
            <img
              src="/dashboard-preview.png"
              alt="About Workaholic"
              className="
                w-full
                rounded-[28px]
                border
                border-gray-100
              "
            />

          </div>

        </div>

        {/* CONTENT */}
        <div>

          {/* BADGE */}
          <div className="
            inline-flex
            items-center
            gap-2
            bg-[#FDF2F2]
            text-[#8B1A1A]
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
            mb-6
          ">

            <ShieldCheck size={16} />

            About Workaholic

          </div>

          {/* TITLE */}
          <h2 className="
            text-3xl
            md:text-5xl
            font-extrabold
            text-gray-900
            leading-tight
            mb-8
          ">
            Dibangun untuk Membantu Fresh Graduate Memulai Karier
          </h2>

          {/* DESCRIPTION */}
          <div className="
            space-y-6
            text-gray-600
            text-lg
            leading-relaxed
          ">

            <p>
              <span className="font-bold text-[#8B1A1A]">
                Workaholic
              </span>{" "}
              hadir sebagai platform berbasis AI
              yang membantu pengguna menganalisis CV,
              meningkatkan kualitas resume,
              dan menemukan pekerjaan entry-level
              yang lebih relevan secara otomatis.
            </p>

            <p>
              Platform ini dikembangkan oleh{" "}
              <span className="font-bold text-[#8B1A1A]">
                W Team
              </span>{" "}
              sebagai project Coding Camp Dicoding 2026
              dengan fokus pada pengalaman pengguna
              yang modern, sederhana, dan mudah digunakan.
            </p>

          </div>

          {/* MINI FEATURES */}
          <div className="grid grid-cols-2 gap-4 mt-10">

            {[
              "AI CV Analyzer",
              "ATS Friendly Review",
              "Job Recommendation",
              "Career Dashboard",
            ].map((item) => (
              <div
                key={item}
                className="
                  bg-[#F8F8F8]
                  rounded-2xl
                  p-4
                  flex
                  items-center
                  gap-3
                  hover:bg-[#FDF2F2]
                  transition-all
                "
              >

                <CheckCircle2
                  size={18}
                  className="text-[#8B1A1A]"
                />

                <p className="
                  font-semibold
                  text-gray-700
                  text-sm
                ">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>

  </section>
);

// ─────────────────────────────────────────────
// HOW IT WORKS REDESIGN
// ─────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload CV",
      desc: "Unggah CV ATS Friendly dalam format PDF dengan mudah dan cepat",
      icon: <FileSearch size={28} />,
    },

    {
      number: "02",
      title: "AI Menganalisis CV",
      desc: "Sistem akan membaca skill, pengalaman, dan kecocokan kariermu secara otomatis",
      icon: <BarChart3 size={28} />,
    },

    {
      number: "03",
      title: "Dapatkan Rekomendasi Kerja",
      desc: "Temukan lowongan entry-level yang paling sesuai dengan profilmu",
      icon: <BriefcaseBusiness size={28} />,
    },
  ];

  return (
    <section className="relative py-28 bg-white overflow-hidden">

      {/* BLUR BACKGROUND */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#8B1A1A]/5 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B1A1A]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center mb-20">

          <div className="inline-flex items-center gap-2 bg-[#FDF2F2] text-[#8B1A1A] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            Simple Process
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Bagaimana Cara Kerjanya?
          </h2>

          <p className="text-gray-500 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Hanya dengan 3 langkah mudah untuk memulai perjalanan kariermu bersama Workaholic.
          </p>

        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          {steps.map((step, index) => (
            <div
              key={index}
              className="
                relative
                bg-white
                border border-gray-100
                rounded-[36px]
                p-10
                shadow-sm
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
                group
                overflow-hidden
              "
            >

              {/* BACKGROUND NUMBER */}
              <div className="absolute top-5 right-6 text-7xl font-black text-[#8B1A1A]/5 select-none">
                {step.number}
              </div>

              {/* ICON */}
              <div
                className="
                  w-16 h-16
                  rounded-3xl
                  bg-[#FDF2F2]
                  text-[#8B1A1A]
                  flex items-center justify-center
                  mb-8
                  group-hover:bg-[#8B1A1A]
                  group-hover:text-white
                  transition-all
                  duration-500
                "
              >
                {step.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-black text-gray-900 mb-5 leading-snug">
                {step.title}
              </h3>

              {/* DESC */}
              <p className="text-gray-500 leading-relaxed text-base">
                {step.desc}
              </p>

              {/* LINE CONNECTOR */}
              {index !== steps.length - 1 && (
                <div
                  className="
                    hidden md:block
                    absolute
                    top-1/2
                    -right-5
                    w-10
                    h-[2px]
                    bg-gradient-to-r
                    from-[#8B1A1A]/40
                    to-transparent
                  "
                />
              )}

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────
const JobGrid = ({ navigate }) => {
  const isLoggedIn =
    localStorage.getItem("token");

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "PT Teknologi Nusantara",
      salary: "Rp 5jt - 8jt",
      location: "Jakarta",
      match: "92%",
    },

    {
      id: 2,
      title: "UI/UX Designer",
      company: "Startup Inovasi",
      salary: "Rp 4jt - 7jt",
      location: "Bandung",
      match: "89%",
    },

    {
      id: 3,
      title: "React Developer",
      company: "Digital Creative",
      salary: "Rp 6jt - 10jt",
      location: "Remote",
      match: "95%",
    },

    {
      id: 4,
      title: "Backend Developer",
      company: "Nexa Digital",
      salary: "Rp 5jt - 9jt",
      location: "Yogyakarta",
      match: "90%",
    },

    {
      id: 5,
      title: "Mobile Developer",
      company: "Creative Tech",
      salary: "Rp 6jt - 11jt",
      location: "Surabaya",
      match: "93%",
    },

    {
      id: 6,
      title: "Data Analyst",
      company: "Insight Solution",
      salary: "Rp 5jt - 8jt",
      location: "Hybrid",
      match: "88%",
    },
  ];

  // HANDLE DETAIL
  const handleDetail = (id) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/jobs/${id}`);
    }
  };

  return (
    <section className="bg-[#8B1A1A] py-28">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Rekomendasi Lowongan
          </h2>

          <p className="text-white/80 mt-5 max-w-2xl mx-auto leading-relaxed">
            Temukan pekerjaan yang paling sesuai dengan kemampuan dan minatmu.
          </p>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {jobs.map((job, i) => (
            <div
              key={i}
              className="
                bg-white
                rounded-[32px]
                p-8
                shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
                group
              "
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F2] flex items-center justify-center group-hover:bg-[#8B1A1A] transition-all">

                  <BriefcaseBusiness className="text-[#8B1A1A] group-hover:text-white transition-all" />

                </div>

                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                  Match {job.match}
                </div>

              </div>

              {/* TITLE */}
              <h3 className="text-xl font-black text-gray-900 leading-snug">
                {job.title}
              </h3>

              {/* COMPANY */}
              <p className="text-gray-500 mt-2">
                {job.company}
              </p>

              {/* INFO */}
              <div className="mt-8 space-y-3 text-sm text-gray-500">

                <div className="flex items-center justify-between">

                  <span>Lokasi</span>

                  <span className="font-semibold text-gray-800">
                    {job.location}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span>Gaji</span>

                  <span className="font-semibold text-[#8B1A1A]">
                    {job.salary}
                  </span>

                </div>

              </div>

              {/* BUTTON */}
              <button
                onClick={() =>
                  handleDetail(job.id)
                }
                className="
                  w-full
                  mt-8
                  py-4
                  rounded-2xl
                  bg-[#8B1A1A]
                  hover:bg-[#701515]
                  text-white
                  font-bold
                  transition-all
                "
              >
                Lihat Detail
              </button>

            </div>
          ))}

        </div>

        {/* MORE */}
        <div className="text-center mt-16">

          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all"
          >
            Lihat Semua Lowongan

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
};

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
const Statistics = () => {

  const stats = [
    {
      number: "1200+",
      label: "CV Dianalisis",
      icon: "📄",
    },

    {
      number: "350+",
      label: "Lowongan Aktif",
      icon: "💼",
    },

    {
      number: "89%",
      label: "ATS Accuracy",
      icon: "🎯",
    },

    {
      number: "500+",
      label: "Fresh Graduate Terbantu",
      icon: "🚀",
    },
  ];

  return (
    <section className="relative py-28 bg-[#F7F7F7] overflow-hidden">

      {/* background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* heading */}
        <div className="text-center mb-16">

          <p className="
            inline-flex
            px-4
            py-2
            rounded-full
            bg-red-50
            text-[#8B1A1A]
            text-sm
            font-semibold
            mb-5
          ">
            Trusted Career Platform
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
            Membantu Kandidat <br />
            Menemukan Karier Terbaik
          </h2>

          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Platform berbasis AI yang membantu pencarian kerja menjadi
            lebih cepat, tepat, dan modern
          </p>

        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((item, i) => (
            <div
              key={i}
              className="
                group
                relative
                overflow-hidden
                rounded-[32px]
                bg-white/80
                backdrop-blur-xl
                border border-white
                p-8
                text-center
                shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                hover:-translate-y-2
                hover:shadow-[0_20px_60px_rgba(139,26,26,0.12)]
                transition-all
                duration-500
              "
            >

              {/* subtle glow */}
              <div className="
                absolute
                inset-0
                bg-gradient-to-br
                from-red-50
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-500
              "></div>

              <div className="relative z-10">

                {/* icon */}
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-red-50
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-6
                  text-2xl
                ">
                  {item.icon}
                </div>

                {/* number */}
                <h2 className="
                  text-4xl
                  md:text-5xl
                  font-black
                  text-[#8B1A1A]
                  mb-3
                ">
                  {item.number}
                </h2>

                {/* label */}
                <p className="
                  text-gray-500
                  font-medium
                  leading-relaxed
                ">
                  {item.label}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
const CTA = ({ navigate }) => (
  <section className="relative py-32 px-6 bg-[#F7F7F7] overflow-hidden">

    {/* background blur */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-100 blur-3xl opacity-40 rounded-full"></div>

    <div className="max-w-6xl mx-auto relative z-10">

      {/* floating card */}
      <div className="
        relative
        overflow-hidden
        rounded-[40px]
        bg-gradient-to-br
        from-[#A61D1D]
        via-[#8B1A1A]
        to-[#701313]
        shadow-[0_20px_80px_rgba(139,26,26,0.35)]
        px-8
        md:px-16
        py-14
        md:py-16
      ">

        {/* glow accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative z-10">

          {/* LEFT CONTENT */}
          <div className="max-w-2xl">

            {/* badge */}
            <div className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/10
              border
              border-white/20
              text-sm
              text-white
              mb-6
              backdrop-blur-md
            ">
              ✨ AI Powered Career Platform
            </div>

            {/* heading */}
            <h2 className="
              text-4xl
              md:text-5xl
              font-extrabold
              text-white
              leading-tight
              mb-6
            ">
              Siap Memulai <br />
              Karier Impianmu?
            </h2>

            {/* description */}
            <p className="
              text-white/80
              text-lg
              leading-relaxed
              max-w-xl
              mb-10
            ">
              Upload CV sekarang dan biarkan AI membantu menemukan
              pekerjaan terbaik sesuai skill, pengalaman, dan potensi unikmu
            </p>

            {/* mini stats */}
            <div className="flex flex-wrap gap-4">

              <div className="
                px-5 py-4
                rounded-2xl
                bg-white/10
                border border-white/10
                backdrop-blur-md
              ">
                <p className="text-2xl font-bold text-white">1200+</p>
                <p className="text-sm text-white/70">CV Reviewed</p>
              </div>

              <div className="
                px-5 py-4
                rounded-2xl
                bg-white/10
                border border-white/10
                backdrop-blur-md
              ">
                <p className="text-2xl font-bold text-white">350+</p>
                <p className="text-sm text-white/70">Jobs Available</p>
              </div>

              <div className="
                px-5 py-4
                rounded-2xl
                bg-white/10
                border border-white/10
                backdrop-blur-md
              ">
                <p className="text-2xl font-bold text-white">89%</p>
                <p className="text-sm text-white/70">ATS Accuracy</p>
              </div>

            </div>

          </div>

          {/* RIGHT BUTTON */}
          <div className="w-full lg:w-auto">

            <button
              onClick={() => navigate("/analysis")}
              className="
                group
                w-full lg:w-auto
                px-10
                py-5
                rounded-2xl
                bg-white
                text-[#8B1A1A]
                font-bold
                text-lg
                hover:scale-105
                transition-all
                duration-300
                shadow-xl
                hover:shadow-2xl
              "
            >
              <span className="flex items-center gap-3">
                Upload CV Sekarang
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("token");

  return (
  <div className="font-sans antialiased bg-white selection:bg-[#8B1A1A] selection:text-white">

      {/* NAVBAR */}
      {isLoggedIn ? (
        <Navbar fixed />
      ) : (
        <LandingNavbar fixed />
      )}

      <main>

        <Hero navigate={navigate} />

        <TechnologySection />

        <FeaturesSection />

        <AboutUs />

        <HowItWorks />

        <JobGrid navigate={navigate} />

        <Statistics />

        <CTA navigate={navigate} />

      </main>

      <Footer />

    </div>
  );
}