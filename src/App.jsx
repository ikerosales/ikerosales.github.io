import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import CareerTimeline from "./components/CareerTimeline/CareerTimeline";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

const App = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111]">
        <Hero />
        <About />
        <CareerTimeline />
        <Projects />
        <Contact />
      </main>
    </>
  );
};

export default App;
