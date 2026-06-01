export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-[#D9A7A7] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Workaholic Logo"
              className="h-20 mb-1"
            />
          </div>

          <nav className="flex flex-wrap justify-center gap-8 md:gap-16">
            {["Lowongan", "Upload CV", "Analisis", "Wishlist"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[#8B1A1A] font-bold text-base hover:opacity-70 transition-opacity"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white py-4 border-t border-gray-200 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-black font-bold text-[13px] tracking-tight">
            © 2026 Workaholic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}