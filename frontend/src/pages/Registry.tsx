import React, { useEffect, useState } from "react";
import { getProjects } from "../utils/api";

interface Project {
  id: number; name: string; project_type: string; country: string;
  standard: string; price: number; available: number; annual_co2: number;
  status: string; vintage: number;
}

const STATUS_CLASS: Record<string, string> = {
  Verified: "badge-green",
  "Under Review": "badge-amber",
  Flagged: "badge-red",
};

const STATUS_DOT: Record<string, string> = {
  Verified: "#16a34a",
  "Under Review": "#d97706",
  Flagged: "#dc2626",
};

const Registry: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => { getProjects().then(setProjects); }, []);

  const counts = {
    All: projects.length,
    Verified: projects.filter((p) => p.status === "Verified").length,
    "Under Review": projects.filter((p) => p.status === "Under Review").length,
    Flagged: projects.filter((p) => p.status === "Flagged").length,
  };

  const filtered = filter === "All" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      {/* Stats banner */}
      <div className="portfolio-banner mb-14">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="pb-stat">
            <div className="pb-val">{v}</div>
            <div className="pb-lbl">{k === "All" ? "Total Projects" : k}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Project Registry</span>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.keys(counts).map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${filter === s ? "btn-green" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s} <span style={{ opacity: 0.7 }}>({counts[s as keyof typeof counts]})</span>
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Type</th>
              <th className="r">Annual CO₂</th>
              <th className="r">Vintage</th>
              <th className="r">Standard</th>
              <th className="r">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="project-name">{p.name}</div>
                  <div className="project-sub">{p.country}</div>
                </td>
                <td style={{ color: "var(--slate-500)", fontSize: 12 }}>{p.project_type}</td>
                <td className="r mono">{p.annual_co2.toLocaleString()} t</td>
                <td className="r" style={{ color: "var(--slate-500)" }}>{p.vintage}</td>
                <td className="r">
                  <span className={`badge ${p.standard === "Gold Standard" || p.standard === "Verra VCS" ? "badge-green" : p.standard === "ACR" ? "badge-blue" : "badge-amber"}`}>
                    {p.standard}
                  </span>
                </td>
                <td className="r">
                  <span style={{ fontSize: 12, fontWeight: 500, color: STATUS_DOT[p.status] ?? "#64748b", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_DOT[p.status], display: "inline-block" }} />
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Registry;
