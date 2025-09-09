import React from "react";
import { MapPin, Zap, Droplet, Layers, Package, Feather } from "lucide-react";

const Recommendations = () => {
  const recommendations = [
    {
      title: "Low Tree Density",
      desc: "Priority afforestation/reforestation site detected.",
      metric: "Tree cover: 25%",
      priority: "High",
      icon: <Layers className="w-6 h-6 mr-2" />,
      color: "bg-red-100",
    },
    {
      title: "Low CO₂ Absorption",
      desc: "CO₂ absorption below baseline target.",
      metric: "CO₂ absorbed: 50 Mt/year",
      priority: "Medium",
      icon: <Zap className="w-6 h-6 mr-2" />,
      color: "bg-yellow-100",
    },
    {
      title: "Degraded Land",
      desc: "Phased afforestation recommended.",
      metric: "Area: 10 sq.km",
      priority: "Medium",
      icon: <Feather className="w-6 h-6 mr-2" />,
      color: "bg-green-100",
    },
    {
      title: "Forest Loss",
      desc: "Forest lost in last 5 years.",
      metric: "5 sq.km lost",
      priority: "High",
      icon: <Package className="w-6 h-6 mr-2" />,
      color: "bg-blue-100",
    },
    {
      title: "Riparian Zones",
      desc: "Riparian buffer plantations suggested.",
      metric: "2 km river/stream affected",
      priority: "Medium",
      icon: <Droplet className="w-6 h-6 mr-2" />,
      color: "bg-teal-100",
    },
    {
      title: "Carbon Credits",
      desc: "Areas eligible for carbon credits.",
      metric: "Sites: Site A, Site B",
      priority: "Low",
      icon: <MapPin className="w-6 h-6 mr-2" />,
      color: "bg-purple-100",
    },
  ];

  const priorityColors = {
    High: "bg-red-500 text-white",
    Medium: "bg-yellow-500 text-white",
    Low: "bg-green-500 text-white",
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`${rec.color} rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between`}
          >
            <div className="flex items-center mb-2">
              {rec.icon}
              <h3 className="text-xl font-semibold">{rec.title}</h3>
            </div>
            <p className="text-gray-700 mb-2">{rec.desc}</p>
            <p className="text-gray-600 font-medium mb-3">{rec.metric}</p>
            <span
              className={`inline-block px-2 py-1 text-sm font-semibold rounded ${priorityColors[rec.priority]}`}
            >
              {rec.priority} Priority
            </span>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-gray-200 text-gray-800 rounded px-2 py-1 hover:bg-gray-300 transition">
                View on Map
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 rounded px-2 py-1 hover:bg-gray-300 transition">
                More Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
