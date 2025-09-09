import { useMemo } from "react";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function CarbonEmissionReport({ rows = [] }) {
  // Dummy data if no rows passed
  const dataRows = useMemo(
    () =>
      rows.length > 0
        ? rows
        : [
            { activity: "Diesel Combustion", unit: "litres", qty: 1500, factor: 2.68, co2: 4020 },
            { activity: "Electricity", unit: "kWh", qty: 12000, factor: 0.82, co2: 9840 },
            { activity: "Explosives", unit: "kg", qty: 300, factor: 1.5, co2: 450 },
          ],
    [rows]
  );

  // Chart.js data
  const barData = {
    labels: dataRows.map((r) => r.activity),
    datasets: [
      {
        label: "CO₂ Emissions (t)",
        data: dataRows.map((r) => r.co2),
        backgroundColor: "rgba(34, 87, 122, 0.7)", // gov blue
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: dataRows.map((r) => r.activity),
    datasets: [
      {
        label: "Share of Emissions",
        data: dataRows.map((r) => r.co2),
        backgroundColor: [
          "rgba(34, 87, 122, 0.7)",
          "rgba(84, 150, 182, 0.7)",
          "rgba(200, 200, 200, 0.7)",
          "rgba(122, 34, 45, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  function download(type) {
    const header = "Activity,Unit,Quantity,EmissionFactor,CO2(t)\n";
    const body = dataRows
      .map((r) => `${r.activity},${r.unit},${r.qty},${r.factor},${r.co2}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ema_emission_report.${type}`;
    link.click();
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <SectionTitle
        title="Carbon Emission Report"
        subtitle="Activity-wise computed results & Dashboard"
      />

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gov-bg">
            <tr>
              {["Activity", "Unit", "Quantity", "Emission Factor", "CO₂ (t)"].map((h) => (
                <th key={h} className="border px-3 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">{r.activity}</td>
                <td className="border px-3 py-2">{r.unit}</td>
                <td className="border px-3 py-2">{r.qty}</td>
                <td className="border px-3 py-2">{r.factor}</td>
                <td className="border px-3 py-2">{r.co2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => download("csv")}
          className="rounded-xl border px-4 py-2 hover:bg-gov-bg"
        >
          Download CSV
        </button>
        <button disabled className="rounded-xl border px-4 py-2 opacity-50">
          Download Excel
        </button>
        <button disabled className="rounded-xl border px-4 py-2 opacity-50">
          Download PDF
        </button>
      </div>

      {/* Dashboard */}
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Emissions by Activity (Bar Chart)</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-gray-50 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Share of Total Emissions (Pie Chart)</h3>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
