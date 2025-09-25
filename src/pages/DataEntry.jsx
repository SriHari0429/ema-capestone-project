import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";

export default function DataEntry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    activity: "Diesel Combustion",
    unit: "",
    quantity: "",
    fuelType: "",
    electricitySource: "",
    transportMode: "",
    distance: "",
    landArea: "",
    methaneVolume: "",
  });

  const [report, setReport] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function calculateEmissions() {
    let emissions = 0;
    let explanation = "";

    switch (form.activity) {
      case "Diesel Combustion": {
        const q = parseFloat(form.quantity || 0);
        if (form.fuelType === "Diesel") {
          emissions = q * 2.68;
          explanation = `Diesel EF = 2.68 × ${q} litres`;
        } else if (form.fuelType === "Petrol") {
          emissions = q * 2.31;
          explanation = `Petrol EF = 2.31 × ${q} litres`;
        } else if (form.fuelType === "Coal") {
          emissions = q * 2.42;
          explanation = `Coal EF = 2.42 × ${q} kg`;
        } else if (form.fuelType === "Natural Gas") {
          emissions = q * 1.9;
          explanation = `Natural Gas EF = 1.9 × ${q} m³`;
        }
        break;
      }

      case "Electricity Consumption": {
        const q = parseFloat(form.quantity || 0);
        emissions = q * 0.82;
        explanation = `Grid EF = 0.82 × ${q} kWh`;
        break;
      }

      case "Explosives Usage": {
        const q = parseFloat(form.quantity || 0);
        emissions = q * 970;
        explanation = `Explosives EF = 970 × ${q} tons`;
        break;
      }

      case "Transportation": {
        const tons = parseFloat(form.quantity || 0);
        const km = parseFloat(form.distance || 0);
        let modeEF = 0;
        if (form.transportMode === "Truck") modeEF = 0.1;
        if (form.transportMode === "Rail") modeEF = 0.02;
        if (form.transportMode === "Ship") modeEF = 0.015;
        if (form.transportMode === "Air") modeEF = 0.6;
        emissions = tons * km * modeEF;
        explanation = `${form.transportMode} EF = ${modeEF} × ${tons} tons × ${km} km`;
        break;
      }

      case "Fugitive Methane": {
        const v = parseFloat(form.methaneVolume || 0);
        const density = 0.716;
        const gwp = 28;
        emissions = v * density * gwp;
        explanation = `${v} m³ × 0.716 × 28 (GWP)`;
        break;
      }

      case "Land Disturbance / Deforestation": {
        const ha = parseFloat(form.landArea || 0);
        emissions = ha * 300000;
        explanation = `${ha} ha × 300,000`;
        break;
      }

      case "Coal Extraction": {
        const q = parseFloat(form.quantity || 0);
        emissions = q * 2.42;
        explanation = `Coal Extraction EF = 2.42 × ${q} tons`;
        break;
      }

      default:
        emissions = 0;
    }

    const newReport = {
      id: crypto.randomUUID(), // ✅ unique ID
      activity: form.activity,
      emissions: parseFloat(emissions.toFixed(2)),
      unit: form.unit,
      explanation,
      timestamp: Date.now(),
    };

    setReport(newReport);

    // ✅ Save to localStorage
   const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
existingReports.push(newReport);
localStorage.setItem("reports", JSON.stringify(existingReports));
  }

  function submit(e) {
    e.preventDefault();
    calculateEmissions();
  }

  function showResults() {
    if (report) {
      navigate("/carbon-emission-report", { state: { report } });
    }
  }

  function showSinkAnalysis() {
  if (report) {
    navigate("/carbon-sink-analysis", { state: { report } });
  }
}

  function resetForm() {
    setForm({
      activity: "Diesel Combustion",
      unit: "",
      quantity: "",
      fuelType: "",
      electricitySource: "",
      transportMode: "",
      distance: "",
      landArea: "",
      methaneVolume: "",
    });
    setReport(null);
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-card">
      <SectionTitle
        title="Data Entry"
        subtitle="Enter activity-wise data to compute emissions"
      />
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        {/* Activity */}
        <div>
          <label className="block text-sm mb-1">Activity *</label>
          <select
            name="activity"
            value={form.activity}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            required
          >
            <option>Diesel Combustion</option>
            <option>Electricity Consumption</option>
            <option>Explosives Usage</option>
            <option>Fugitive Methane</option>
            <option>Coal Extraction</option>
            <option>Land Disturbance / Deforestation</option>
            <option>Transportation</option>
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm mb-1">Unit *</label>
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            required
          >
            <option value="">-- Select Unit --</option>
            <option>litres</option>
            <option>kWh</option>
            <option>tons</option>
            <option>hectares</option>
            <option>m³</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm mb-1">Quantity *</label>
          <input
            type="number"
            name="quantity"
            step="any"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="e.g., 1500"
            required
          />
        </div>

        {/* Extra fields */}
        {form.activity === "Diesel Combustion" && (
          <div>
            <label className="block text-sm mb-1">Fuel Type *</label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              required
            >
              <option value="">-- Select Fuel --</option>
              <option>Diesel</option>
              <option>Petrol</option>
              <option>Coal</option>
              <option>Natural Gas</option>
            </select>
          </div>
        )}

        {form.activity === "Transportation" && (
          <>
            <div>
              <label className="block text-sm mb-1">Transport Mode *</label>
              <select
                name="transportMode"
                value={form.transportMode}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2"
                required
              >
                <option value="">-- Select Mode --</option>
                <option>Truck</option>
                <option>Rail</option>
                <option>Ship</option>
                <option>Air</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Distance (km) *</label>
              <input
                type="number"
                name="distance"
                step="any"
                value={form.distance}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2"
                placeholder="e.g., 250"
                required
              />
            </div>
          </>
        )}

        {form.activity === "Land Disturbance / Deforestation" && (
          <div>
            <label className="block text-sm mb-1">Land Area (hectares) *</label>
            <input
              type="number"
              name="landArea"
              step="any"
              value={form.landArea}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="e.g., 5"
              required
            />
          </div>
        )}

        {form.activity === "Fugitive Methane" && (
          <div>
            <label className="block text-sm mb-1">Methane Volume (m³) *</label>
            <input
              type="number"
              name="methaneVolume"
              step="any"
              value={form.methaneVolume}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="e.g., 100"
              required
            />
          </div>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-4 mt-4">
          <GovButton type="submit">Calculate</GovButton>
          <GovButton type="button" onClick={resetForm}>
            Reset
          </GovButton>
        </div>
      </form>

      {/* Report Preview */}
      {report && (
        <div className="mt-8 p-6 rounded-2xl border bg-gray-50">
          <h3 className="text-lg font-semibold text-gov-ink">
            Emission Report
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            <strong>Activity:</strong> {report.activity}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            <strong>Total Emissions:</strong> {report.emissions} kg CO₂e
          </p>
          <p className="mt-1 text-sm text-gray-700">
            <strong>Unit:</strong> {report.unit}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Calculation: {report.explanation}
          </p>

          <GovButton type="button" className="mt-4" onClick={showResults}>
            Show Results
          </GovButton>
        </div>
      )}
    </div>
  );
}
