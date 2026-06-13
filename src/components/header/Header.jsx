import { NavLink } from "react-router-dom";
import "./Header.css";

const NAV_ITEMS = [
  { to: "/tree",     icon: "bi-diagram-3-fill",    label: "Ağac"       },
  { to: "/search",   icon: "bi-search",             label: "Axtarış"    },
  { to: "/add",      icon: "bi-person-plus-fill",   label: "Şəxs əlavə"},
  { to: "/map",      icon: "bi-geo-alt-fill",        label: "Xəritə"     },
  { to: "/relation", icon: "bi-share-fill",          label: "Qohumluq"   },
  { to: "/stats",    icon: "bi-bar-chart-fill",      label: "Statistika" },
  { to: "/help",     icon: "bi-question-circle",     label: "Kömək"      },
];

export default function Header({ activeForestName, onOpenForests }) {
  return (
    <header className="az-header fixed-top shadow">
      <div className="az-header__inner">
        {/* Logo + ağac seçici */}
        <div className="az-header__brand">
          <NavLink to="/" className="az-header__logo">
            <i className="bi bi-tree-fill me-1"></i>
            <span>AzGenealogy</span>
          </NavLink>
          {activeForestName && (
            <button className="az-header__forest-btn" onClick={onOpenForests} title="Ağacları idarə et">
              <i className="bi bi-collection me-1"></i>
              <span className="az-header__forest-name">{activeForestName}</span>
              <i className="bi bi-chevron-down ms-1" style={{ fontSize: ".7rem" }}></i>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="az-header__nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "az-header__link" + (isActive ? " az-header__link--active" : "")
              }
              title={label}
            >
              <i className={`bi ${icon}`}></i>
              <span className="az-header__label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
