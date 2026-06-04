import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, getMarketOverview } from "../utils/api";

interface Project {
  id: number;
  name: string;
  project_type: string;
  country: string;
  standard: string;
  price: number;
  available: number;
  status: string;
  vintage: number;
}

interface Overview {
  spot_price: number;
  change_24h: number;
  volume_24h: number;
  active_listings: number;
}

const STANDARD_CLASS: Record<string, string> = {
  "Gold Standard": "badge-green",
  "Verra VCS": "badge-green",
  ACR: "badge-blue",
  CAR: "badge-amber",
};

const TYPE_FILTERS = ["All", "Forest", "Solar", "Wind", "Wetland", "Cooking"];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getMarketOverview()]).then(([p, o]) => {
      setProjects(p);
      setOverview(o);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "All"
    ? projects.filter((p) => p.status === "Verified")
    : projects.filter(
        (p) => p.status === "Verified" && p.project_type.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <div>
      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Market Price (tCO₂)</div>
          <div className="metric-value">${overview?.spot_price.toFixed(2) ?? "—"}</div>
          <div className="metric-change up">▲ {overview?.change_24h}% today</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">24h Volume</div>
          <div className="metric-value">{overview ? (overview.volume_24h / 1000).toFixed(0) + "K" : "—"}</div>
          <div className="metric-sub">credits traded</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Active Listings</div>
          <div className="metric-value">{overview?.active_listings.toLocaleString() ?? "—"}</div>
          <div className="metric-sub">across {filtered.length} projects</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Top Standard</div>
          <div className="metric-value" style={{ fontSize: 16 }}>Gold Standard</div>
          <div className="metric-sub" style={{ color: "var(--green-600)", fontWeight: 500 }}>Verra VCS</div>
        </div>
      </div>

      {/* Listings */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Live Credit Listings</span>
          <div style={{ display: "flex", gap: 6 }}>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-green" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-row">Loading listings…</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th className="r">Price</th>
                <th className="r">Available</th>
                <th className="r">Vintage</th>
                <th className="r">Standard</th>
                <th className="r">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="project-name">{p.name}</div>
                    <div className="project-sub">{p.project_type} · {p.country}</div>
                  </td>
                  <td className="r mono" style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td className="r mono">{p.available.toLocaleString()} t</td>
                  <td className="r" style={{ color: "var(--slate-500)" }}>{p.vintage}</td>
                  <td className="r">
                    <span className={`badge ${STANDARD_CLASS[p.standard] ?? "badge-amber"}`}>
                      {p.standard}
                    </span>
                  </td>
                  <td className="r">
                    <button
                      className="btn btn-green btn-sm"
                      onClick={() => navigate(`/trade?project=${p.id}&side=buy`)}
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
