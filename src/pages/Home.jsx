import { Link } from "react-router-dom";
import { Leaf, Factory, Trees, Droplet, Globe } from "lucide-react";
import GovButton from "../components/ui/GovButton.jsx";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  // Awareness messages with icons
  const messages = [
    { icon: Globe, text: "Rising CO₂ levels are warming the Earth rapidly." },
    { icon: Trees, text: "Deforestation reduces our natural carbon sinks." },
    { icon: Factory, text: "Coal mining contributes over 40% of global CO₂ emissions." },
    { icon: Droplet, text: "Climate change threatens water and food security." },
    { icon: Leaf, text: "Sustainable practices can cut emissions drastically." },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <section className="grid gap-12">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-gov-bg to-white p-10 shadow-card text-center">
        <h1 className="font-serif text-4xl text-gov-navy">
          Track, Reduce, and Offset Carbon Emissions
        </h1>
        <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
          The Emission Monitoring Authority (EMA) is India’s official platform 
          for standardized monitoring of coal mine emissions, carbon sinks, 
          and offset planning — ensuring accuracy, transparency, and compliance 
          with national climate commitments.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login"><GovButton>Get Started</GovButton></Link>
          <Link
            to="/about"
            className="inline-flex items-center rounded-xl border px-4 py-2 font-semibold hover:bg-gov-bg"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Emission Tracking", desc: "Comprehensive activity-based monitoring with verified factors.", icon: Factory },
          { title: "Carbon Sink Analysis", desc: "Measure natural absorption through forests & landscapes.", icon: Trees },
          { title: "Recommendations", desc: "Government-backed strategies for emission reduction.", icon: Leaf },
        ].map((c) => (
          <div 
            key={c.title} 
            className="rounded-2xl bg-white p-6 shadow-card flex flex-col items-center text-center"
          >
            <c.icon className="text-gov-chakra h-10 w-10 mb-3" />
            <h3 className="font-semibold text-gov-ink text-lg">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Awareness Section */}
      <div className="rounded-2xl bg-gov-navy p-8 shadow-card text-center">
        <h2 className="text-2xl font-serif mb-4 text-black">Why Carbon Matters</h2>
        <p className="max-w-3xl text-gray-800 mx-auto">
          Excess carbon dioxide and methane from coal mining and industry 
          trap heat in the atmosphere, driving global warming. 
          India’s forests and ecosystems act as vital carbon sinks, 
          but increasing deforestation and industrial activity are 
          tipping the balance. Through collective action, we can restore 
          this balance and safeguard future generations.
        </p>
      </div>

      {/* Scrolling Awareness Messages with Animation */}
      <div className="rounded-xl bg-white p-4 shadow-md border h-16 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current} // 👈 triggers animation when index changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 w-full justify-center"
          >
            {(() => {
              const Icon = messages[current].icon;
              return <Icon className="h-6 w-6 text-gov-secondary" />;
            })()}
            <p className="text-gov-secondary font-medium text-lg">
              {messages[current].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
