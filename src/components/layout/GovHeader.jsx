import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogOut, Home, Info, FileText, Database, BarChart, Lightbulb, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function GovHeader() {
  const { user, logout } = useAuth();

  const linkBase =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gov-ink hover:underline hover:text-gov-chakra transition";

  const activeLink = "text-base font-semibold underline text-gov-chakra";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Identity section */}
      <div className="bg-gov-navy text-white px-4 py-6 flex flex-col items-center">
  <Link to="/" className="flex flex-col items-center">
    <img
      src="/logonobg.png"
      alt="State Emblem"
      className="h-22 w-22 mb-2 cursor-pointer"
    />
    <h1 className="text-center font-serif text-sm leading-tight text-black">
      Emission Monitoring Authority <br />
      <span className="text-xs opacity-80">Government of India</span>
    </h1>
  </Link>
</div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-5 overflow-y-auto">
        {/* General Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            General
          </p>
          <NavLink
            to="/"
            className={({ isActive }) =>
              (isActive ? activeLink : "") + " " + linkBase
            }
          >
            <Home size={16} /> Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              (isActive ? activeLink : "") + " " + linkBase
            }
          >
            <Info size={16} /> About
          </NavLink>
        </div>

        {/* Modules Section */}
        {user && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Modules
            </p>
            <NavLink
              to="/data-entry"
              className={({ isActive }) =>
                (isActive ? activeLink : "") + " " + linkBase
              }
            >
              <Database size={16} /> Data Entry
            </NavLink>
            <NavLink
              to="/carbon-emission-report"
              className={({ isActive }) =>
                (isActive ? activeLink : "") + " " + linkBase
              }
            >
              <FileText size={16} /> Emission Report
            </NavLink>
            <NavLink
              to="/carbon-sink-analysis"
              className={({ isActive }) =>
                (isActive ? activeLink : "") + " " + linkBase
              }
            >
              <BarChart size={16} /> Sink Analysis
            </NavLink>
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                (isActive ? activeLink : "") + " " + linkBase
              }
            >
              <Lightbulb size={16} /> Recommendations
            </NavLink>
            <NavLink
  to="/reports"
  className={({ isActive }) =>
    (isActive ? activeLink : "") + " " + linkBase
  }
>
  <FileText size={16} /> Reports
</NavLink>
          </div>
        )}

        {/* Authentication Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            {user ? "Account" : "Access"}
          </p>
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full justify-start rounded-lg border px-3 py-2 text-sm hover:bg-gov-bg text-gov-ink"
            >
              <LogOut size={16} /> Sign out
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  (isActive ? activeLink : "") + " " + linkBase
                }
              >
                <LogIn size={16} /> Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  (isActive ? activeLink : "") + " " + linkBase
                }
              >
                <UserPlus size={16} /> Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}
