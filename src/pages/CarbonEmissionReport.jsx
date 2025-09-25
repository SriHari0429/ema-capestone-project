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



export default function CarbonEmissionReport() {
  const location = useLocation();
  const dashboardRef = useRef(null);
  const [report, setReport] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  // ✅ Load latest report persistently
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

  // 🔑 Calculations
  const emissionsNum = parseFloat(report.emissions || 0);
  const treesNeeded = (emissionsNum / 21).toFixed(1); // avg tree absorbs ~21kg CO₂/year
  const carKm = (emissionsNum / 0.120).toFixed(0); // avg petrol car = 120 g/km
  const flights = (emissionsNum / 90).toFixed(1); // 1 hr domestic flight ≈ 90kg CO₂/passenger
  const households = (emissionsNum / 915).toFixed(2); // avg household electricity monthly ~915kg

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
  // Q&A Content
  const qaData = [
    {
      q: "What is Emission?",
      a: "Emissions are greenhouse gases (like CO₂) released into the atmosphere as a result of human activities such as burning fuel, transportation, or electricity usage.",
    },
    {
      q: "What is Neutral Goal?",
      a: "The Neutral Goal represents the balance point where emissions are completely offset by carbon absorption (through trees, forests, or other means), achieving 'net-zero'.",
    },
    {
      q: "How do you calculate Emission vs Neutral Goal?",
      a: "We compare your activity’s emissions against a neutral benchmark (1000 kg CO₂e). The pie chart shows how much you emitted versus how much remains before reaching neutrality.",
    },
    {
      q: "What is Emission Context?",
      a: "Emission context helps you understand the scale of your activity’s impact by comparing it with relatable benchmarks like car travel, flights, or household energy use.",
    },
  ];

  // 🖨️ Save dashboard as PDF
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      let position = 0;
      let heightLeft = imgHeight;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    // Save in localStorage
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    const newReport = {
      ...report,
      id: Date.now(),
      pdf: imgData,
    };
    savedReports.push(newReport);
    localStorage.setItem("reports", JSON.stringify(savedReports));

    pdf.save(`report-${report.activity}.pdf`);
  };
  

  return (
    <div className="p-8 space-y-10">
      {/* Wrap dashboard for PDF snapshot */}
      <div ref={dashboardRef}>
        {/* Dashboard Title */}
        <div>
          <h1 className="text-4xl font-bold text-gov-ink">
            🌍 Emission Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            A scientific + visual breakdown of your activity’s climate impact.
          </p>
        </div>

        {/* KPI Highlight */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <div className="rounded-2xl border bg-white shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Activity</h3>
            <p className="text-lg font-semibold text-gov-ink mt-2">
              {report.activity}
            </p>
          </div>

          <div className="rounded-2xl border bg-white shadow p-6 bg-red-50">
            <h3 className="text-sm font-medium text-gray-500">Total Emissions</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {report.emissions} kg CO₂e
            </p>
          </div>

          <div className="rounded-2xl border bg-white shadow p-6 bg-green-50">
            <h3 className="text-sm font-medium text-gray-500">Trees Needed</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {treesNeeded}
            </p>
          </div>

          <div className="rounded-2xl border bg-white shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Unit</h3>
            <p className="text-lg font-semibold text-gov-ink mt-2">
              {report.unit || "N/A"}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Pie Chart */}
          <div className="rounded-2xl bg-white shadow p-6">
            <h2 className="text-lg font-semibold text-gov-ink mb-4">
              Your Emission vs Neutral Goal
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val} kg CO₂e`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl bg-white shadow p-6">
            <h2 className="text-lg font-semibold text-gov-ink mb-4">
              Emission Context
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(val) => `${val} kg CO₂e`} />
                <Bar dataKey="emission" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📊 Insights Card */}
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
      High emissions contribute to global warming 🌡️, rising sea levels 🌊, and extreme weather events ⛈️.
      Reducing emissions through renewable energy, efficiency, and offsets like afforestation is critical.
    </p>
  </div>
</div>

      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        ⬇️ Download PDF
      </button>

      <div className="rounded-2xl bg-white p-6 border shadow mt-8">
          <h2 className="text-2xl font-bold text-gov-ink mb-4">❓ Q&A</h2>
          {qaData.map((item, index) => (
            <div key={index} className="border-b py-3">
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-medium text-gray-800">{item.q}</span>
                <span className="text-gray-500">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </button>
              {openIndex === index && (
                <p className="text-gray-600 mt-2">{item.a}</p>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}
