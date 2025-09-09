import { Outlet } from "react-router-dom";
import GovHeader from "./GovHeader.jsx";
import GovFooter from "./GovFooter.jsx";

export default function PageShell() {
  return (
    <div className="flex flex-col min-h-screen bg-gov-bg text-gov-ink">
      {/* Accessibility link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border px-3 py-2"
      >
        Skip to content
      </a>

      {/* Header */}
      <GovHeader />

      {/* Main grows and pushes footer */}
      <main id="main" className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <GovFooter />
    </div>
  );
}
