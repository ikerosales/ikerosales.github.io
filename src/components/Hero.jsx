import React from "react";
import headIcon from "../assets/icons/head-icon.png";
import { motion } from "framer-motion";

const linesBg = (
  <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,400 Q360,300 720,400 T1440,400" stroke="#ffee10" strokeOpacity="0.08" strokeWidth="2" fill="none" />
    <path d="M0,320 Q360,220 720,320 T1440,320" stroke="#ffee10" strokeOpacity="0.06" strokeWidth="2" fill="none" />
    <path d="M0,240 Q360,140 720,240 T1440,240" stroke="#ffee10" strokeOpacity="0.04" strokeWidth="2" fill="none" />
    <path d="M0,160 Q360,60 720,160 T1440,160" stroke="#ffee10" strokeOpacity="0.03" strokeWidth="2" fill="none" />
  </svg>
);

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-[70vh] flex flex-col justify-center items-center px-4 pt-32 pb-20 bg-[#111] overflow-hidden"
      style={{ position: "relative" }}
    >
      {linesBg}
      <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-5xl mx-auto gap-8 md:gap-16">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="flex flex-col items-center md:items-start"
        >
          <img
            src={headIcon}
            alt="Iker Rosales head icon"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#ffee10] bg-[#222] shadow-lg mb-4"
            style={{ boxShadow: "0 0 32px 0 #ffee10aa" }}
          />
          <span className="hidden md:block text-[#ffee10] font-semibold text-sm mt-2 tracking-widest">IKER ROSALES SAIZ</span>
        </motion.div>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            <span className="text-white">Hi, I'm </span>
            <span className="text-[#ffee10]">Iker</span>
            <span className="text-white"> Rosales</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#ffee10] drop-shadow">
            Data Science & Telecommunications Engineering @ UC3M / USYD | Ex-AWS
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
            I like building useful stuff around <span className="text-[#ffee10] font-semibold">AI</span>, <span className="text-[#ffee10] font-semibold">Cloud</span> and <span className="text-[#ffee10] font-semibold">Telecommunications</span>: from multi-agent recommenders to NLP dashboards and network research.<br className="hidden md:block" />
            Currently finishing my dual degree while doing AI research in Sydney.
          </p>
        </motion.div>
      </div>
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex flex-col items-center cursor-pointer"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        onClick={() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="8" r="5" fill="#ffee10" />
          <path d="M16 13V26" stroke="#ffee10" strokeWidth="3" strokeLinecap="round"/>
          <path d="M10 20L16 26L22 20" stroke="#ffee10" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="text-[#ffee10] text-xs mt-1 font-semibold tracking-widest">SCROLL</span>
      </motion.div>
    </section>
  );
};

export default Hero;
