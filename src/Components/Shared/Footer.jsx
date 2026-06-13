import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    titleClassName: "text-[#f97316]",
    links: ["Job discovery", "Worker AI", "Companies", "Salary data"],
  },
  {
    title: "Navigation",
    titleClassName: "text-[#4a9eff]",
    links: ["Help center", "Career library", "Contact"],
  },
  {
    title: "Resources",
    titleClassName: "text-[#a78bfa]",
    links: ["Brand Guideline", "Newsroom"],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    className: "border border-[#2a3244] bg-[#151c2c] hover:bg-[#1e2a40]",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "Pinterest",
    className: "bg-[#e60023] text-white hover:bg-[#cc0020]",
    icon: (
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    ),
  },
  {
    label: "LinkedIn",
    className: "border border-[#2a3244] bg-[#151c2c] hover:bg-[#1e2a40]",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.5A6 6 0 0 1 16 8zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative mx-auto w-full overflow-hidden bg-[#0d1117]">
      <FooterPattern />

      <div className="relative z-10 mx-auto max-w-[1600px] px-8 pb-12 pt-20 sm:px-12">
        <div className="mb-14 flex flex-col justify-between gap-14 lg:flex-row">
          <div className="flex max-w-[320px] flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <h2 className="text-4xl font-black tracking-tight">
                <span className="text-[#0A84FF]">hire</span>
                <span className="text-[#FF8A00]">loop</span>
              </h2>
            </Link>

            <p className="text-[14px] leading-relaxed text-[#8b9ab5]">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>

            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((socialLink) => (
                <a
                  key={socialLink.label}
                  aria-label={socialLink.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${socialLink.className}`}
                  href="#"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {socialLink.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:gap-20">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className={`mb-6 text-[14px] font-semibold ${section.titleClassName}`}>
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((linkText) => (
                    <li key={linkText}>
                      <Link
                        href="#"
                        className="text-[14px] text-[#8b9ab5] hover:text-white"
                      >
                        {linkText}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 h-px bg-[#1e2a3a]" />

        <div className="flex flex-col justify-between text-[13px] text-[#4a5568] sm:flex-row">
          <span>Copyright 2024 - Hire Loop</span>
          <div className="flex gap-2">
            <Link href="#">Terms & Policy</Link>
            <span>-</span>
            <Link href="#">Privacy Guideline</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none opacity-[0.07]">
      <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            height="80"
            id="footer-grid"
            patternUnits="userSpaceOnUse"
            width="80"
            x="0"
            y="0"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#4a9eff"
              strokeWidth="0.6"
            />
          </pattern>
          <pattern
            height="80"
            id="footer-dots"
            patternUnits="userSpaceOnUse"
            width="80"
            x="0"
            y="0"
          >
            <circle cx="0" cy="0" fill="#4a9eff" r="2" />
            <circle cx="80" cy="0" fill="#4a9eff" r="2" />
            <circle cx="0" cy="80" fill="#4a9eff" r="2" />
            <circle cx="80" cy="80" fill="#4a9eff" r="2" />
            <circle cx="40" cy="40" fill="#4a9eff" r="1.5" />
          </pattern>
        </defs>
        <rect fill="url(#footer-grid)" height="100%" width="100%" />
        <rect fill="url(#footer-dots)" height="100%" width="100%" />
      </svg>
    </div>
  );
}
