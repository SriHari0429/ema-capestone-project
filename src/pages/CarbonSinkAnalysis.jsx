import { useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import SectionTitle from "../components/ui/SectionTitle.jsx";
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
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "../styles/geoSearchCustom.css";
import L from "leaflet";

// ✅ Fix default marker icon
const DefaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ✅ Search Box Component
function SearchBox() {
  const map = useMap();
  useEffect(() => {
    try {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: true,
        autoClose: true,
        keepResult: true,
        searchLabel: "Search for a location...",
      });
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    } catch (err) {
      console.error("SearchBox init failed:", err);
    }
  }, [map]);
  return null;
}

export default function CarbonSinkAnalysis() {
  const location = useLocation();
  const [report, setReport] = useState(null);

  // ✅ Load report
  useEffect(() => {
    try {
      if (location.state?.report) {
        setReport(location.state.report);
      } else {
        const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
        if (savedReports.length > 0) {
          setReport(savedReports[savedReports.length - 1]);
        }
      }
    } catch (err) {
      console.error("Error loading report:", err);
    }
  }, [location.state]);

  // ✅ Always run useMemo, even if report is null
  const sinkData = useMemo(() => {
    if (!report) {
      return {
        emissionsNum: 0,
        treeAbsorption: 0,
        forestAbsorption: 0,
        wetlandAbsorption: 0,
        soilAbsorption: 0,
        totalAbsorbed: 0,
        remainingEmissions: 0,
        numTrees: 0,
      };
    }

    const emissionsNum = parseFloat(report.emissions || 0);

    const numTrees = 10;
    const treeAbsorption = numTrees * 21;

    const forestArea = parseFloat(report.landArea || 0);
    const forestAbsorption = forestArea * 10000;

    const wetlandArea = 0;
    const wetlandAbsorption = wetlandArea * 4000;

    const soilArea = 0;
    const soilAbsorption = soilArea * 2000;

    const totalAbsorbed =
      treeAbsorption + forestAbsorption + wetlandAbsorption + soilAbsorption;

    const remainingEmissions = Math.max(0, emissionsNum - totalAbsorbed);

    return {
      emissionsNum: isNaN(emissionsNum) ? 0 : emissionsNum,
      treeAbsorption,
      forestAbsorption,
      wetlandAbsorption,
      soilAbsorption,
      totalAbsorbed,
      remainingEmissions,
      numTrees,
    };
  }, [report]);

  const pieData = [
    { name: "Absorbed by Sinks", value: sinkData.totalAbsorbed },
    { name: "Remaining Emissions", value: sinkData.remainingEmissions },
  ];

  const pieColors = ["#10B981", "#EF4444"];

  const barData = [
    { ecosystem: "Trees", value: sinkData.treeAbsorption },
    { ecosystem: "Forest", value: sinkData.forestAbsorption },
    { ecosystem: "Wetlands", value: sinkData.wetlandAbsorption },
    { ecosystem: "Soil", value: sinkData.soilAbsorption },
  ];

  const center = [23.5937, 80.9629]; // India centroid

  // ✅ Show "no report" UI but without skipping hooks
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

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-4xl font-bold text-gov-ink">🌱 Sink Analysis</h1>
      <p className="text-gray-600 mt-2">
        Analysis of your activity emissions versus potential absorption by
        natural carbon sinks.
      </p>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border bg-white shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Your Emissions</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {sinkData.emissionsNum} kg CO₂e
          </p>
        </div>
        <div className="rounded-2xl border bg-white shadow p-6 bg-green-50">
          <h3 className="text-sm font-medium text-gray-500">Absorbed by Sinks</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {sinkData.totalAbsorbed} kg CO₂e
          </p>
        </div>
        <div className="rounded-2xl border bg-white shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Remaining Emissions
          </h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {sinkData.remainingEmissions} kg CO₂e
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-gov-ink mb-4">
            Emissions vs Sinks
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
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} kg CO₂e`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-gov-ink mb-4">
            Absorption by Ecosystem
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ecosystem" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} kg CO₂e`} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <SectionTitle
          title="Carbon Sink Assessment"
          subtitle="Tree cover visualization with Satellite + Forest Overlay"
        />
        <div className="h-[700px] w-full md:w-[95%] mx-auto overflow-hidden rounded-2xl border shadow">
          <MapContainer
            center={center}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution="&copy; Esri &mdash; Boundaries and Places"
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='&copy; <a href="https://www.globalforestwatch.org/">Global Forest Watch</a>'
              url="https://storage.googleapis.com/earthenginepartners-hansen/GFC-2020-v1.8/Hansen_GFC-2020-v1.8_treecover2000/{z}/{x}/{y}.png"
            />
            <SearchBox />
            <Marker position={center} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
