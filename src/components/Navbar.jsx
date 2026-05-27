import React, { useState, useEffect } from "react";
import headIcon from "../assets/icons/head-icon.png";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "career", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled ? "bg-[#111]/90 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <img
            src={headIcon}
            alt="Iker Rosales logo"
            className="w-9 h-9 rounded-full border-2 border-[#ffee10] bg-[#222] shadow group-hover:scale-105 transition"
          />
          <span className="text-lg font-bold text-[#ffee10] tracking-wide group-hover:text-white transition">Iker Rosales</span>
        </a>
        <ul className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="text-gray-200 hover:text-[#ffee10] font-medium text-base transition px-2 py-1 rounded"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="#ffee10" />
            <rect y="11" width="24" height="2" rx="1" fill="#ffee10" />
            <rect y="17" width="24" height="2" rx="1" fill="#ffee10" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#111]/95 backdrop-blur-sm border-t border-[#ffee10]/10 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-[#ffee10] text-lg font-semibold py-2 px-2 rounded hover:bg-[#ffee10]/10 transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
