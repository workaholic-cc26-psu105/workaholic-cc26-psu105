import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();

  return (
    <footer className="
      relative
      overflow-hidden
      bg-[#F6EEEE]
      pt-24
      pb-10
      px-6
    ">

      {/* soft glow */}
      <div className="
        absolute
        top-[-100px]
        left-1/2
        -translate-x-1/2
        w-[700px]
        h-[300px]
        bg-[#D9A7A7]
        opacity-20
        blur-3xl
        rounded-full
      "></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* TOP */}
        <div className="
          flex
          flex-col
          lg:flex-row
          justify-between
          gap-16
          pb-14
          border-b
          border-[#E7D6D6]
        ">

          {/* LEFT */}
          <div className="max-w-md">

            {/* logo */}
            <img
              src="/logo.png"
              alt="Workaholic Logo"
              className="h-20 mb-6 object-contain"
            />

            {/* description */}
            <p className="
              text-[#8D6E6E]
              leading-relaxed
              text-[15px]
            ">
              Workaholic membantu kandidat menemukan pekerjaan
              terbaik melalui analisis CV berbasis AI,
              ATS checking, dan job matching yang lebih cerdas
              dan modern
            </p>

            {/* mini badge */}
            <div className="
              mt-6
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/70
              border
              border-[#E7D6D6]
              text-[#8B1A1A]
              text-sm
              font-medium
              shadow-sm
            ">
              ✨ AI Powered Career Platform
            </div>

          </div>

          {/* RIGHT */}
          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-12
          ">

            {/* Navigation */}
            <div>

              <h3 className="
                text-[#5C3A3A]
                font-bold
                mb-6
              ">
                Navigation
              </h3>

              <div className="flex flex-col gap-4">

                {[
                  { label: "Lowongan", path: "/jobs" },
                  { label: "Tersimpan", path: "/saved" },
                  { label: "Upload CV", path: "/analysis" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="
                      text-left
                      text-[#8D6E6E]
                      hover:text-[#8B1A1A]
                      transition-all
                      duration-300
                    "
                  >
                    {item.label}
                  </button>
                ))}

              </div>

            </div>

            {/* Features */}
            <div>

              <h3 className="
                text-[#5C3A3A]
                font-bold
                mb-6
              ">
                Features
              </h3>

              <div className="
                flex
                flex-col
                gap-4
                text-[#8D6E6E]
              ">

                <p>AI CV Analysis</p>
                <p>ATS Checker</p>
                <p>Job Matching</p>

              </div>

            </div>

            {/* Connect */}
            <div>

              <h3 className="
                text-[#5C3A3A]
                font-bold
                mb-6
              ">
                Connect
              </h3>

              <div className="
                flex
                flex-col
                gap-4
              ">

                <a
                  href="#"
                  className="
                    text-[#8D6E6E]
                    hover:text-[#8B1A1A]
                    transition-all
                    duration-300
                  "
                >
                  Instagram
                </a>

                <a
                  href="#"
                  className="
                    text-[#8D6E6E]
                    hover:text-[#8B1A1A]
                    transition-all
                    duration-300
                  "
                >
                  LinkedIn
                </a>

                <a
                  href="#"
                  className="
                    text-[#8D6E6E]
                    hover:text-[#8B1A1A]
                    transition-all
                    duration-300
                  "
                >
                  Github
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="
          pt-8
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-5
        ">

          <p className="
            text-sm
            text-[#9C7B7B]
          ">
            © 2026 Workaholic. All rights reserved.
          </p>

          <div className="
            flex
            gap-6
            text-sm
          ">

            <button className="
              text-[#9C7B7B]
              hover:text-[#8B1A1A]
              transition-all
            ">
              Privacy Policy
            </button>

            <button className="
              text-[#9C7B7B]
              hover:text-[#8B1A1A]
              transition-all
            ">
              Terms of Service
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}