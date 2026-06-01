import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


// --- DATA ---
const features = [
  {
    title: "Rekomendasi Pekerjaan Pintar",
    desc: "Dapatkan lowongan kerja yang sesuai dengan skill dan minatmu.",
    img: "search.png"
  },
  {
    title: "AI CV Review",
    desc: "Perbaiki CV kamu dengan saran otomatis agar lebih menarik bagi recruiter.",
    img: "review.png"
  },
  {
    title: "Khusus Entry-Level",
    desc: "Dirancang khusus untuk fresh graduate tanpa pengalaman kerja.",
    img: "Like.png"
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
  }
];

// --- COMPONENTS ---
const Hero = () => {
  return (
    <section className="pt-44 pb-24 bg-gradient-to-b from-white via-[#FDF2F2] to-[#F2D1D1] px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        
        {/* Konten Teks */}
        <div className="md:w-1/2 text-left relative z-10">

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.15] mb-8 tracking-tight">
            Mulai Karier Pertama <br className="hidden lg:block"/> dengan Lebih Pasti
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-lg leading-relaxed font-normal">
            Gunakan keunggulan AI untuk menganalisis CV dan temukan peluang kerja <span className="text-[#8B1A1A] font-semibold">entry-level</span> yang paling presisi dengan bakatmu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-4 bg-[#8B1A1A] text-white font-bold text-sm rounded-xl shadow-[0_10px_20px_-5px_rgba(139,26,26,0.4)] hover:bg-[#701515] transition-all transform hover:-translate-y-1">
              Upload CV Sekarang
            </button>
            <button className="px-10 py-4 bg-white/50 backdrop-blur-sm text-[#8B1A1A] border border-[#D9A7A7] font-bold text-sm rounded-xl hover:bg-white transition-all transform hover:-translate-y-1">
              Lihat Lowongan
            </button>
          </div>

          {/* Statistik Singkat - Opsional untuk menambah kredibilitas */}
          <div className="mt-12 flex items-center gap-8 border-t border-gray-200/50 pt-8">
          </div>
        </div>

        {/* Gambar/Ilustrasi */}
        <div className="md:w-1/2 flex justify-center relative">
          {/* Elemen dekoratif di belakang gambar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/30 rounded-full blur-3xl -z-10"></div>
          <img 
            src="hero.png" 
            alt="Hero Illustration" 
            className="w-full max-w-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] object-contain" 
          />
        </div>

      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section className="bg-gradient-to-b from-[#F2D1D1] to-[#D9A7A7] pb-32">
    {/* Header Section dengan penyesuaian ukuran teks */}
    <div className="bg-white py-12 mb-20 shadow-sm flex justify-center items-center border-b border-gray-100">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#8B1A1A] tracking-tight">
        Fitur Unggulan untuk Kariermu
      </h2>
    </div>

    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <div 
            key={i} 
            className="bg-white rounded-[40px] p-10 shadow-xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2"
          >
            {/* Judul Kartu */}
            <h3 className="text-xl md:text-2xl font-bold text-[#8B1A1A] mb-8 min-h-[80px] flex items-center tracking-tight">
              {f.title}
            </h3>

            {/* Container Gambar */}
            <div className="w-28 h-28 flex items-center justify-center">
              <img src={f.img} alt={f.title} className="w-full h-full object-contain" />
            </div>

            {/* Deskripsi */}
            <p className="text-gray-600 text-base font-medium leading-relaxed px-2">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  const nextSlide = () => {
    setActive((prev) => (prev === howItWorksData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActive((prev) => (prev === 0 ? howItWorksData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => { setActive((prev) => (prev === howItWorksData.length - 1 ? 0 : prev + 1)); }, 5000); 
    return () => clearInterval(timer); }, []); // kosong karena pakai functional update

  return (
    <section className="bg-[#D9A7A7] pt-20">
      <div className="bg-white rounded-t-[100px] md:rounded-t-[180px] pt-16 pb-20 w-full shadow-lg">
        
        <div className="max-w-6xl mx-auto px-6">
          {/* Judul */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16 tracking-tight">
            Bagaimana Workaholic Membantumu?
          </h2>

          <div className="relative flex items-center justify-center">
            {/* Tombol Navigasi */}
            <button 
              onClick={prevSlide}
              className="absolute -left-2 md:-left-8 p-3 rounded-full bg-[#FDF2F2] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white transition-all shadow-sm z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Slide Card */}
            <div className="w-full max-w-4xl bg-[#8B1A1A] rounded-[48px] p-12 md:p-20 text-center text-white min-h-[280px] flex items-center justify-center shadow-2xl transition-all duration-500">
              <p className="text-lg md:text-2xl font-semibold leading-relaxed tracking-wide" key={active}>
                {howItWorksData[active].desc}
              </p>
            </div>

            <button 
              onClick={nextSlide}
              className="absolute -right-2 md:-right-8 p-3 rounded-full bg-[#FDF2F2] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white transition-all shadow-sm z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Indikator Titik */}
          <div className="flex justify-center gap-3 mt-12">
            {howItWorksData.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActive(i)} 
                className={`h-2 transition-all duration-300 rounded-full ${active === i ? "w-10 bg-[#8B1A1A]" : "w-2 bg-gray-200"}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const JobGrid = () => (
  <section className="bg-[#8B1A1A] relative z-10">
    <div className="w-full bg-white rounded-b-[100px] md:rounded-b-[180px] pt-10 pb-24 shadow-2xl">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Judul */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12 tracking-tight">
          Lowongan untuk Kamu
        </h2>

        {/* Filter Dropdowns */}
        <div className="flex justify-end gap-4 mb-12">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 px-6 pr-10 text-[13px] font-semibold text-gray-600 focus:outline-none focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] shadow-sm cursor-pointer transition-all">
              <option>Tipe Kerja</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Internship</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 px-6 pr-10 text-[13px] font-semibold text-gray-600 focus:outline-none focus:border-[#8B1A1A] focus:ring-1 focus:ring-[#8B1A1A] shadow-sm cursor-pointer transition-all">
              <option>Semua Pendidikan</option>
              <option>SMA/SMK</option>
              <option>D3</option>
              <option>S1</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Grid Kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="aspect-square bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner hover:bg-gray-100 transition-colors duration-300"
            ></div>
          ))}
        </div>

        {/* Navigasi Bawah */}
        <div className="text-center mt-16">
          <button className="text-sm font-bold text-gray-900 hover:text-[#8B1A1A] flex items-center gap-2 mx-auto transition-all group">
            Lihat lebih banyak 
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-28 bg-[#8B1A1A] text-center text-white px-6 -mt-20 relative z-0">
    <div className="max-w-4xl mx-auto pt-16">
      {/* Judul */}
      <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
        Siap Memulai Kariermu?
      </h2>
      
      {/* Deskripsi */}
      <p className="mb-12 text-lg md:text-xl font-medium opacity-90 leading-relaxed max-w-2xl mx-auto">
        Upload CV sekarang dan temukan pekerjaan yang paling tepat untuk potensi unikmu.
      </p>
      
      {/* Tombol */}
      <button className="px-12 py-4 bg-[#D9A7A7] text-[#8B1A1A] font-bold text-base rounded-xl shadow-xl transition-all hover:bg-[#C89696] hover:scale-105 active:scale-95">
        Upload CV Sekarang
      </button>
    </div>
  </section>
);


export default function LandingPage() {
  return (
    <div className="font-sans antialiased bg-white selection:bg-[#8B1A1A] selection:text-white">
      <Navbar fixed />
      <main>
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <JobGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

