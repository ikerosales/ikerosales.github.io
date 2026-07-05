import React from "react";
import githubIcon from "../assets/icons/icons8-github.svg";
import linkedinIcon from "../assets/icons/icons8-linkedin.svg";
import emailIcon from "../assets/icons/email-svgrepo-com.svg";
import cvIcon from "../assets/icons/curriculum-vitae-svgrepo-com.svg";

const CONTACTS = [
  {
    name: "GitHub",
    url: "https://github.com/ikerosales",
    icon: githubIcon,
    label: "ikerrosales",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/iker-rosales-saiz/",
    icon: linkedinIcon,
    label: "iker-rosales-saiz",
  },
  {
    name: "Email",
    url: "mailto:iker251203@gmail.com",
    icon: emailIcon,
    label: "iker251203@gmail.com",
  },
  {
    name: "CV",
    url: "/CV_Iker_Rosales_03_2026.pdf",
    icon: cvIcon,
    label: "Download PDF",
  },
];

const Contact = () => {
  return (
    <section id="contact" className="w-full py-16 bg-[#111] flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#ffee10] mb-10">Contact</h2>
      <div className="flex flex-row justify-center gap-12 w-full max-w-2xl mt-8">
        {CONTACTS.map((contact, idx) => (
          <a
            key={contact.name + "-icon"}
            href={contact.url}
            target={contact.name === "Email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="relative group"
          >
            <img
              src={contact.icon}
              alt={contact.name + " icon"}
              className="w-14 h-14 md:w-16 md:h-16 transition-all duration-300 drop-shadow-lg"
              style={{ filter: 'invert(1) brightness(2)' }}
              onMouseOver={e => e.currentTarget.style.filter = 'invert(81%) sepia(97%) saturate(749%) hue-rotate(358deg) brightness(104%) contrast(105%)'}
              onMouseOut={e => e.currentTarget.style.filter = 'invert(1) brightness(2)'}
            />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-[#ffee10] opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 font-semibold">
              {contact.name}
            </span>
            <span className="absolute inset-0 rounded-full group-hover:scale-125 group-hover:bg-[#ffee10]/10 transition-all duration-300 pointer-events-none" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
