import { Routes, Route, Navigate } from "react-router-dom";
import PageShell from "./components/layout/PageShell.jsx";
import ProtectedRoute from "./guards/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import DataEntry from "./pages/DataEntry.jsx";
import CarbonEmissionReport from "./pages/CarbonEmissionReport.jsx";
import CarbonSinkAnalysis from "./pages/CarbonSinkAnalysis.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Report from "./pages/Reports.jsx";

export default function RoutesDef() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/data-entry"
          element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carbon-emission-report"
          element={
            <ProtectedRoute>
              <CarbonEmissionReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carbon-sink-analysis"
          element={
            <ProtectedRoute>
              <CarbonSinkAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
