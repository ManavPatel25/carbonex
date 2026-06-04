import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Marketplace", icon: "📊" },
  { to: "/trade", label: "Trade", icon: "🔄" },
  { to: "/portfolio", label: "Portfolio", icon: "🗂" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/wallet", label: "Wallet", icon: "💳" },
  { to: "/registry", label: "Registry", icon: "🛡" },
  { to: "/advisor", label: "AI Advisor", icon: "🤖" },
];

const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <div className="logo">
      <span className="logo-icon">🌿</span>
      CarbonEx
    </div>

    <nav>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === "/"}
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-spacer" />

    <div className="sidebar-footer">
      <div className="nav-item">
        <span className="nav-icon">👤</span>
        Account
      </div>
    </div>
  </aside>
);

export default Sidebar;
