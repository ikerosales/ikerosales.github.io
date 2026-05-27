import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { aboutData } from "../constants";
import { FaCloud, FaRobot, FaBrain } from "react-icons/fa";
import myPic from "../assets/my_pic.jpg";

const skills = [
  {
    title: "Machine Learning",
    icon: <FaRobot size={40} className="text-[#ffee10]" />,
    desc: "Applied Machine Learning, forecasting and predictive systems",
  },
  {
    title: "Cloud",
    icon: <FaCloud size={40} className="text-[#ffee10]" />,
    desc: "AWS, architecture basics, and cloud projects.",
  },
  {
    title: "LLMs",
    icon: <FaBrain size={40} className="text-[#ffee10]" />,
    desc: "LLM workflows, multi-agent systems, and applied NLP.",
  },
];

const fadeIn = (direction = "up", type = "spring", delay = 0, duration = 0.7) => {
  let x = 0, y = 0;
  if (direction === "left") x = -40;
  if (direction === "right") x = 40;
  if (direction === "up") y = 40;
  if (direction === "down") y = -40;
  return {
    initial: { opacity: 0, x, y },
    animate: { opacity: 1, x: 0, y: 0, transition: { type, delay, duration } },
  };
};

const CardGlass = ({ skill, i }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [12, -12]);
  const rotateY = useTransform(x, [-30, 30], [-12, 12]);
  const iconX = useTransform(x, [-40, 40], [-8, 8]);
  const iconY = useTransform(y, [-40, 40], [-8, 8]);
  const [iconHover, setIconHover] = React.useState(false);

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    x.set(mx / 5);
    y.set(my / 5);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIconHover(false);
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeIn("right", "spring", i * 0.2, 0.8)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="w-full max-w-xs bg-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-[#ffee10]/30 shadow-xl cursor-pointer relative overflow-hidden group p-1 mb-8"
      whileHover={{ scale: 1.055, boxShadow: "0 8px 32px 0 #ffee10cc" }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl z-0"
        animate={{ background: [
          "linear-gradient(120deg, #ffee10cc 0%, transparent 100%)",
          "linear-gradient(240deg, #ffee10cc 0%, transparent 100%)",
          "linear-gradient(120deg, #ffee10cc 0%, transparent 100%)"
        ] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ opacity: 0.10 }}
      />
      <div className="bg-[#181818]/90 rounded-2xl py-8 px-6 min-h-[220px] flex flex-col justify-evenly items-center w-full relative z-10">
        <motion.div
          className="mb-4 flex items-center justify-center"
          style={{ x: iconX, y: iconY }}
          animate={iconHover ? { scale: [1, 1.18, 0.95, 1.1, 1], filter: "drop-shadow(0 0 16px #ffee10)" } : { scale: 1, filter: "none" }}
          transition={{ type: "spring", stiffness: 400, damping: 12, duration: 0.7 }}
          onMouseEnter={() => setIconHover(true)}
          onMouseLeave={() => setIconHover(false)}
        >
          {skill.icon}
        </motion.div>
        <h3 className="text-[#ffee10] text-[22px] font-bold text-center mb-2 drop-shadow-lg">
          {skill.title}
        </h3>
        <p className="text-gray-200 text-base text-center opacity-90 font-medium">
          {skill.desc}
        </p>
      </div>
      <motion.div
        className="absolute -inset-1 rounded-2xl pointer-events-none z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.22, boxShadow: "0 0 32px 8px #ffee10" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const About = () => {
  return (
    <section id="about" className="w-full flex flex-col items-center justify-center py-20 bg-[#111] relative overflow-visible">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-[#ffee10] mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        About Me
      </motion.h2>
      <div className="w-full max-w-5xl px-5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-10">
        <motion.div
          className="relative w-44 h-44 md:w-56 md:h-56 rounded-full p-1 bg-[#ffee10]/80 shadow-[0_0_34px_rgba(255,238,16,0.25)] shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#181818]">
            <img
              src={myPic}
              alt="Iker Rosales"
              className="absolute h-[168%] w-auto max-w-none"
              style={{
                left: "56%",
                top: "70%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        </motion.div>

        <motion.p
          className="max-w-2xl text-lg md:text-xl text-gray-100 text-center md:text-left leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {aboutData.description}
        </motion.p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mt-2 z-10">
        {skills.map((skill, i) => <CardGlass key={skill.title} skill={skill} i={i} />)}
      </div>
    </section>
  );
};

export default About;
