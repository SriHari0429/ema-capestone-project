import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  MapPin,
  Zap,
  Droplet,
  Layers,
  Package,
  Feather,
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
          color: "bg-red-100",
        },
        {
          title: "Optimize Engine Performance",
          desc: "Schedule regular maintenance and check combustion efficiency.",
          metric: "Periodic efficiency checks recommended",
          priority: "Medium",
          icon: "layers",
          color: "bg-yellow-100",
        }
      );
    } else {
      recs.push({
        title: "Maintain Efficiency",
        desc: "Your emissions are within acceptable range. Continue monitoring fuel usage monthly.",
        metric: `${emissions} kg CO₂e — Stable`,
        priority: "Low",
        icon: "feather",
        color: "bg-green-100",
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
          color: "bg-yellow-100",
        },
        {
          title: "Reduce Energy Waste",
          desc: "Use smart meters and LED lighting systems.",
          metric: "Track daily usage via smart grid data",
          priority: "Medium",
          icon: "package",
          color: "bg-green-100",
        }
      );
    } else {
      recs.push({
        title: "Efficient Consumption",
        desc: "Your energy usage is optimized. Maintain this through consistent monitoring.",
        metric: `${emissions} kg CO₂e`,
        priority: "Low",
        icon: "mapPin",
        color: "bg-blue-100",
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
          color: "bg-red-100",
        },
        {
          title: "Optimize Routes",
          desc: "Use GPS route optimization and carpooling to reduce trips.",
          metric: "Fuel savings potential: 15-25%",
          priority: "Medium",
          icon: "mapPin",
          color: "bg-yellow-100",
        }
      );
    } else {
      recs.push({
        title: "Maintain Fleet Health",
        desc: "Your transport activity is efficient. Continue low-carbon practices.",
        metric: `${emissions} kg CO₂e`,
        priority: "Low",
        icon: "feather",
        color: "bg-green-100",
      });
    }
  } else {
    recs.push({
      title: "Monitor Activity Trends",
      desc: "Keep tracking emission patterns to detect anomalies or opportunities.",
      metric: `${emissions} kg CO₂e`,
      priority: "Medium",
      icon: "layers",
      color: "bg-gray-100",
    });
  }

  return recs;
};

export default function CarbonEmissionReport() {
  const location = useLocation();
  const dashboardRef = useRef(null);
  const [report, setReport] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (location.state?.report) {
      setReport(location.state.report);
    } else {
      const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
      if (savedReports.length > 0) {
        setReport(savedReports[savedReports.length - 1]);
      }
    }
  }, [location.state]);

  if (!report) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800">
          No report available
        </h2>
        <p className="text-gray-600 mt-2">
          Please enter data in the Data Entry section to generate results.
        </p>
      </div>
    );
  }

  const emissionsNum = parseFloat(report.emissions || 0);
  const treesNeeded = (emissionsNum / 21).toFixed(1);
  const carKm = (emissionsNum / 0.12).toFixed(0);
  const flights = (emissionsNum / 90).toFixed(1);
  const households = (emissionsNum / 915).toFixed(2);

  const pieData = [
    { name: "Your Emission", value: emissionsNum },
    { name: "Remaining to Neutral Goal (1000)", value: Math.max(1000 - emissionsNum, 0) },
  ];
  const COLORS = ["#EF4444", "#E5E7EB"];

  const barData = [
    { label: "Your Activity", emission: emissionsNum },
    { label: "1 Car (100 km)", emission: 12 },
    { label: "1 Flight (1hr)", emission: 90 },
    { label: "1 Household (1 mo)", emission: 915 },
  ];

  const qaData = [
    {
      q: "What is Emission?",
      a: "Emissions are greenhouse gases released due to human activities such as burning fuel or using electricity.",
    },
    {
      q: "What is Neutral Goal?",
      a: "The Neutral Goal is when your total emissions are completely offset, achieving net-zero carbon impact.",
    },
    {
      q: "How is it calculated?",
      a: "Your emissions are compared with neutral benchmarks to show progress toward carbon neutrality.",
    },
  ];

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`report-${report.activity}.pdf`);
  };

  const recommendations = generateRecommendations(report.activity, emissionsNum);

  const icons = {
    zap: <Zap className="w-6 h-6 mr-2" />,
    mapPin: <MapPin className="w-6 h-6 mr-2" />,
    layers: <Layers className="w-6 h-6 mr-2" />,
    feather: <Feather className="w-6 h-6 mr-2" />,
    package: <Package className="w-6 h-6 mr-2" />,
    droplet: <Droplet className="w-6 h-6 mr-2" />,
  };

  const priorityColors = {
    High: "bg-red-500 text-white",
    Medium: "bg-yellow-500 text-white",
    Low: "bg-green-500 text-white",
  };

  return (
    <div className="p-8 space-y-10">
      <div ref={dashboardRef}>
        <h1 className="text-4xl font-bold text-gov-ink">🌍 Emission Dashboard</h1>
        <p className="text-gray-600 mt-2">
          A scientific + visual breakdown of your activity’s climate impact.
        </p>

        {/* KPI Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <div className="rounded-2xl border bg-white shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Activity</h3>
            <p className="text-lg font-semibold text-gov-ink mt-2">{report.activity}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow p-6 bg-red-50">
            <h3 className="text-sm font-medium text-gray-500">Total Emissions</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {report.emissions} kg CO₂e
            </p>
          </div>
          <div className="rounded-2xl border bg-white shadow p-6 bg-green-50">
            <h3 className="text-sm font-medium text-gray-500">Trees Needed</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{treesNeeded}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unit</h3>
            <p className="text-lg font-semibold text-gov-ink mt-2">{report.unit || "N/A"}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl bg-white shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gov-ink">
              Your Emission vs Neutral Goal
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} kg CO₂e`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gov-ink">Emission Context</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(v) => `${v} kg CO₂e`} />
                <Bar dataKey="emission" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white shadow-lg p-6 border mt-6">
          <h2 className="text-2xl font-bold text-gov-ink mb-4 flex items-center">
            <span className="mr-2">📊</span> Interpretation & Insights
          </h2>
          <p className="text-gray-700 mb-4">
            Activity <span className="font-semibold text-gov-ink">{report.activity}</span> generated
            <span className="font-bold text-red-600 mx-1">{report.emissions} kg CO₂e</span> of greenhouse gases.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 rounded-lg p-4 flex items-center">
              <span className="text-red-500 text-2xl mr-3">🚗</span>
              <div>
                <p className="text-gray-600 text-sm">Equivalent driving distance</p>
                <p className="font-semibold text-red-600">{carKm} km</p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
              <span className="text-yellow-600 text-2xl mr-3">✈️</span>
              <div>
                <p className="text-gray-600 text-sm">Equivalent flights</p>
                <p className="font-semibold text-yellow-600">{flights} short flights</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <span className="text-green-600 text-2xl mr-3">🌳</span>
              <div>
                <p className="text-gray-600 text-sm">Trees needed to offset</p>
                <p className="font-semibold text-green-600">{treesNeeded}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <span className="text-blue-600 text-2xl mr-3">🏠</span>
              <div>
                <p className="text-gray-600 text-sm">Household electricity equivalence</p>
                <p className="font-semibold text-blue-600">{households} households / month</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gov-ink">
            <p className="text-gray-700">
              High emissions contribute to global warming 🌡️, rising sea levels 🌊, and extreme weather ⛈️.
              Reducing emissions through renewable energy and afforestation is crucial.
            </p>
          </div>
        </div>

        {/* 🌱 Recommendations Section */}
        <div className="rounded-2xl bg-white shadow-lg p-6 border mt-6">
          <h2 className="text-2xl font-bold text-gov-ink mb-4 flex items-center">
            <span className="mr-2">🌿</span> Recommendations
          </h2>
          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`${rec.color} rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-center mb-2">
                    {icons[rec.icon]}
                    <h3 className="text-lg font-semibold">{rec.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{rec.desc}</p>
                  <p className="text-gray-600 font-medium mb-3">{rec.metric}</p>
                  <span
                    className={`inline-block px-2 py-1 text-sm font-semibold rounded ${priorityColors[rec.priority]}`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No specific recommendations available.</p>
          )}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        ⬇️ Download PDF
      </button>

      {/* Q&A */}
      <div className="rounded-2xl bg-white p-6 border shadow mt-8">
        <h2 className="text-2xl font-bold text-gov-ink mb-4">❓ Q&A</h2>
        {qaData.map((item, i) => (
          <div key={i} className="border-b py-3">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex justify-between items-center w-full text-left"
            >
              <span className="font-medium text-gray-800">{item.q}</span>
              <span className="text-gray-500">{openIndex === i ? "▲" : "▼"}</span>
            </button>
            {openIndex === i && <p className="text-gray-600 mt-2">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
