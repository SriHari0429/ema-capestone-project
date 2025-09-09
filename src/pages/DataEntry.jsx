import { useState } from "react";
import GovButton from "../components/ui/GovButton.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";

export default function DataEntry() {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    alert("Submitted data (wire to backend): " + JSON.stringify(form, null, 2));
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
          <label className="block text-sm mb-1">
            Activity <span className="text-red-600">*</span>
          </label>
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
          <label className="block text-sm mb-1">
            Unit <span className="text-red-600">*</span>
          </label>
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
          <label className="block text-sm mb-1">
            Quantity <span className="text-red-600">*</span>
          </label>
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

        {/* Fuel Type */}
        <div>
          <label className="block text-sm mb-1">Fuel Type</label>
          <select
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="">-- Select Fuel --</option>
            <option>Diesel</option>
            <option>Petrol</option>
            <option>Coal</option>
            <option>Natural Gas</option>
          </select>
        </div>

        {/* Electricity Source (optional free text) */}
        <div>
          <label className="block text-sm mb-1">Electricity Source</label>
          <input
            name="electricitySource"
            value={form.electricitySource}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Grid / Renewable / Captive Plant"
          />
        </div>

        {/* Transport Mode */}
        <div>
          <label className="block text-sm mb-1">Transport Mode</label>
          <select
            name="transportMode"
            value={form.transportMode}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="">-- Select Mode --</option>
            <option>Truck</option>
            <option>Rail</option>
            <option>Ship</option>
            <option>Air</option>
          </select>
        </div>

        {/* Distance (optional) */}
        <div>
          <label className="block text-sm mb-1">Distance (km)</label>
          <input
            type="number"
            step="any"
            name="distance"
            value={form.distance}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="e.g., 120"
          />
        </div>

        {/* Land Area (optional) */}
        <div>
          <label className="block text-sm mb-1">Land Area Affected (ha)</label>
          <input
            type="number"
            step="any"
            name="landArea"
            value={form.landArea}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="e.g., 10"
          />
        </div>

        {/* Methane (optional) */}
        <div>
          <label className="block text-sm mb-1">Methane Released (m³)</label>
          <input
            type="number"
            step="any"
            name="methaneVolume"
            value={form.methaneVolume}
            onChange={handleChange}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="e.g., 500"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-4 mt-4">
          <GovButton type="submit">Submit</GovButton>
          <GovButton
            type="button"
            onClick={() =>
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
              })
            }
          >
            Enter Another
          </GovButton>
        </div>
      </form>
    </div>
  );
}
