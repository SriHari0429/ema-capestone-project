import React, { useEffect, useState } from "react";
import {
  MapPin,
  Zap,
  Droplet,
  Layers,
  Package,
  Feather,
  Info,
  Map,
} from "lucide-react";

// === Dynamic Recommendation Logic ===
const generateRecommendations = (activity, emissions) => {
  const recs = [];

  if (activity === "Diesel Combustion") {
    if (emissions > 2000) {
      recs.push(
        {
          title: "Switch to Cleaner Fuels",
          desc: "Consider biodiesel blends or electrification to reduce emissions drastically.",
          metric: `${emissions} kg CO₂e — High`,
          priority: "High",
          icon: "zap",
          color: "bg-red-50",
        },
        {
          title: "Optimize Engine Performance",
          desc: "Schedule regular maintenance and check combustion efficiency.",
          metric: "Periodic efficiency checks recommended",
          priority: "Medium",
          icon: "layers",
          color: "bg-yellow-50",
        }
      );
    } else {
      recs.push({
        title: "Maintain Efficiency",
        desc: "Your emissions are within acceptable range. Continue monitoring fuel usage monthly.",
        metric: `${emissions} kg CO₂e — Stable`,
        priority: "Low",
        icon: "feather",
        color: "bg-green-50",
      });
    }
  } else if (activity === "Electricity Consumption") {
    if (emissions > 1000) {
      recs.push(
        {
          title: "Adopt Renewable Sources",
          desc: "Install solar panels or buy green power credits.",
          metric: `${emissions} kg CO₂e — Above normal`,
          priority: "High",
          icon: "zap",
          color: "bg-yellow-50",
        },
        {
          title: "Reduce Energy Waste",
          desc: "Use smart meters and LED lighting systems.",
          metric: "Track daily usage via smart grid data",
          priority: "Medium",
          icon: "package",
          color: "bg-green-50",
        }
      );
    } else {
      recs.push({
        title: "Efficient Consumption",
        desc: "Your energy usage is optimized. Maintain this through consistent monitoring.",
        metric: `${emissions} kg CO₂e`,
        priority: "Low",
        icon: "mapPin",
        color: "bg-blue-50",
      });
    }
  } else if (activity === "Transportation") {
    if (emissions > 1500) {
      recs.push(
        {
          title: "Switch to EV Fleet",
          desc: "Transition to electric or hybrid vehicles to cut transport emissions.",
          metric: `${emissions} kg CO₂e — High fleet emissions`,
          priority: "High",
          icon: "zap",
          color: "bg-red-50",
        },
        {
          title: "Optimize Routes",
          desc: "Use GPS route optimization and carpooling to reduce trips.",
          metric: "Fuel savings potential: 15-25%",
          priority: "Medium",
          icon: "mapPin",
          color: "bg-yellow-50",
        }
      );
    } else {
      recs.push({
        title: "Maintain Fleet Health",
        desc: "Your transport activity is efficient. Continue low-carbon practices.",
        metric: `${emissions} kg CO₂e`,
        priority: "Low",
        icon: "feather",
        color: "bg-green-50",
      });
    }
  } else {
    recs.push({
      title: "Monitor Activity Trends",
      desc: "Keep tracking emission patterns to detect anomalies or opportunities.",
      metric: `${emissions} kg CO₂e`,
      priority: "Medium",
      icon: "layers",
      color: "bg-gray-50",
    });
  }

  return recs;
};

const Recommendations = ({ activity, emissions }) => {
  const [recommendations, setRecommendations] = useState([]);

  // Fallback if no props are passed (load from localStorage)
  useEffect(() => {
    let act = activity;
    let em = emissions;
    if (!act || !em) {
      const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
      if (savedReports.length > 0) {
        act = savedReports[savedReports.length - 1].activity;
        em = parseFloat(savedReports[savedReports.length - 1].emissions);
      }
    }
    if (act && em !== undefined) {
      setRecommendations(generateRecommendations(act, em));
    }
  }, [activity, emissions]);

  const icons = {
    zap: <Zap className="w-7 h-7 text-yellow-600 mr-3" />,
    mapPin: <MapPin className="w-7 h-7 text-purple-600 mr-3" />,
    layers: <Layers className="w-7 h-7 text-red-600 mr-3" />,
    feather: <Feather className="w-7 h-7 text-green-600 mr-3" />,
    package: <Package className="w-7 h-7 text-blue-600 mr-3" />,
    droplet: <Droplet className="w-7 h-7 text-teal-600 mr-3" />,
  };

  const priorityColors = {
    High: "bg-red-600 text-white",
    Medium: "bg-yellow-500 text-white",
    Low: "bg-green-600 text-white",
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          🌿 Recommendations Dashboard
        </h2>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-gray-600">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`${rec.color} rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:-translate-y-1 transform`}
            >
              {/* Header */}
              <div className="flex items-center mb-3">
                {icons[rec.icon]}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {rec.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded ${priorityColors[rec.priority]}`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-2 text-sm">{rec.desc}</p>

              {/* Metric */}
              <p className="font-medium text-gray-800 mb-4">{rec.metric}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-1 bg-gov-ink text-white rounded-lg px-3 py-2 hover:bg-gov-ink/90 transition">
                  <Map className="w-4 h-4" /> View on Map
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-800 rounded-lg px-3 py-2 hover:bg-gray-300 transition">
                  <Info className="w-4 h-4" /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-10 bg-gray-50 border-l-4 border-gov-ink rounded p-4 text-gray-700">
        🌱 These recommendations are based on your real-time emission data.
        Implementing them can significantly improve sustainability outcomes and
        reduce your carbon footprint.
      </div>
    </section>
  );
};

export default Recommendations;
