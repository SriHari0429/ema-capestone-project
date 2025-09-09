import SectionTitle from "../components/ui/SectionTitle.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Example images (replace with your own assets in /src/assets)
const images = [
  { src: "/src/assets/coal-mine.jpg", caption: "Coal Mine Emission Tracking", label: "Coal Mine" },
  { src: "/src/assets/forest.jpg", caption: "Carbon Sink Assessment", label: "Forest" },
  { src: "/src/assets/industry.jpg", caption: "Industrial Impact Monitoring", label: "Industry" },
];

export default function About() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto slide effect
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="rounded-2xl bg-white p-10 shadow-card flex flex-col items-center justify-center min-h-[90vh] text-center font-sans">
      {/* Title */}
      <SectionTitle
        title="About EMA"
        subtitle="National Portal for Coal Mine Carbon Tracking"
      />

      {/* Animated Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-gray-700 leading-7 max-w-3xl mt-4"
      >
        The Emission Monitoring Authority (EMA) is India’s official digital platform 
        that enables government agencies to{" "}
        <span className="font-semibold text-gov-navy">
          measure, verify, and report
        </span>{" "}
        carbon emissions from coal mining. EMA also supports the assessment of
        carbon sinks and planning of offsets—ensuring{" "}
        <span className="text-gov-chakra font-medium">
          accuracy, transparency, and accountability
        </span>
        . This centralized system strengthens India’s commitment toward achieving
        carbon neutrality and international climate agreements.
      </motion.p>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-8 max-w-2xl"
      >
        <h3 className="text-gov-navy text-xl font-semibold mb-3">
          Our Mission
        </h3>
        <p className="text-gray-700 leading-7">
          We are building{" "}
          <span className="font-semibold text-gov-navy">
            India’s first tech-driven carbon emissions tracking platform
          </span>{" "}
          tailored for the coal mining sector.  
          Our mission is to help mines{" "}
          <span className="font-medium text-gov-chakra">
            measure, reduce, and offset
          </span>{" "}
          their environmental impact through{" "}
          <span className="font-semibold">
            accurate data, smart analytics, and actionable recommendations
          </span>.
        </p>
      </motion.div>

      {/* Auto-Scrolling Image Carousel */}
      <div
        className="relative mt-10 w-full max-w-3xl rounded-xl shadow-lg overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-96">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[current].src}
              src={images[current].src}
              alt={images[current].caption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-96 object-cover"
            />
          </AnimatePresence>

          {/* Dark overlay with label on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/60 transition duration-500">
            <h2 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
              {images[current].label}
            </h2>
          </div>
        </div>

        {/* Small Caption Always Visible */}
        <p className="text-center text-sm mt-2 text-gray-600 italic">
          {images[current].caption}
        </p>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gov-navy text-white px-3 py-2 rounded-r-xl hover:bg-gov-chakra"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gov-navy text-white px-3 py-2 rounded-l-xl hover:bg-gov-chakra"
        >
          ›
        </button>
      </div>
    </section>
  );
}
