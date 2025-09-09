import { useEffect } from "react";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  GeoSearchControl,
  OpenStreetMapProvider,
} from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "../styles/geoSearchCustom.css"; // 👈 custom search styles

// ✅ Search Box Component
function SearchBox() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
      keepResult: true,
      searchLabel: "Search for a location...", // placeholder
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

export default function CarbonSinkAnalysis() {
  const center = [23.5937, 80.9629]; // India centroid

  return (
    <div className="grid gap-6">
      {/* 🗺️ Map Section */}
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <SectionTitle
          title="Carbon Sink Assessment"
          subtitle="Tree cover visualization with Satellite + Forest Overlay"
        />

        <div className="h-[700px] w-full md:w-[95%] mx-auto overflow-hidden rounded-2xl border shadow-lg">
          <MapContainer
            center={center}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            {/* 🌍 Satellite Basemap */}
            <TileLayer
              attribution="&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            {/* 🏷️ Labels */}
            <TileLayer
              attribution="&copy; Esri &mdash; Boundaries and Places"
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />

            {/* 🌲 Forest Cover Overlay (Global Forest Watch) */}
            <TileLayer
              attribution='&copy; <a href="https://www.globalforestwatch.org/">Global Forest Watch</a>'
              url="https://storage.googleapis.com/earthenginepartners-hansen/GFC-2020-v1.8/Hansen_GFC-2020-v1.8_treecover2000/{z}/{x}/{y}.png"
            />

            {/* 🔍 Search bar */}
            <SearchBox />

            {/* 📍 Example Marker */}
            <Marker position={center} />
          </MapContainer>
        </div>
      </div>

      {/* 📊 Stats Section */}
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h3 className="font-semibold text-gov-ink">Statistics</h3>
        <ul className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
          <li className="rounded-xl border p-4">
            <strong>Total Tree Cover:</strong> 1,250 km²
          </li>
          <li className="rounded-xl border p-4">
            <strong>Estimated CO₂ Absorbed:</strong> 2.3 Mt/year
          </li>
          <li className="rounded-xl border p-4">
            <strong>Priority Afforestation Sites:</strong> 12
          </li>
        </ul>
      </div>
    </div>
  );
}
