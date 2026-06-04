import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend,
} from "chart.js";
import { getPriceChart, getMarketOverview } from "../utils/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const Analytics: React.FC = () => {
  const [prices, setPrices] = useState<number[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [range, setRange] = useState("30D");

  useEffect(() => {
    Promise.all([getPriceChart(), getMarketOverview()]).then(([c, o]) => {
      setPrices(c.prices);
      setOverview(o);
    });
  }, []);

  const labels = Array.from({ length: prices.length }, (_, i) => {
    const d = new Date(2026, 2, 21 + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const lineData = {
    labels,
    datasets: [{
      label: "Price ($/tCO₂)",
      data: prices,
      borderColor: "#1f6b42",
      backgroundColor: "rgba(31,107,66,0.07)",
      borderWidth: 2,
      pointRadius: 0,
      fill: true,
      tension: 0.4,
    }],
  };

  const lineOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 7, font: { size: 11 } }, grid: { display: false } },
      y: { ticks: { callback: (v: any) => `$${v}`, font: { size: 11 } }, grid: { color: "#f1f5f9" } },
    },
  };

  const volumeData = {
    labels: ["Forest", "Solar", "Wind", "Wetland", "Cooking"],
    datasets: [{
      label: "Volume (kt)",
      data: [45, 25, 18, 12, 8],
      backgroundColor: ["#1f6b42", "#2563eb", "#d97706", "#0ea5e9", "#7c3aed"],
      borderWidth: 0,
    }],
  };

  const barOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { font: { size: 11 } }, grid: { display: false } },
      y: { ticks: { font: { size: 11 } }, grid: { color: "#f1f5f9" } },
    },
  };

  const stdData = {
    labels: ["Gold Standard", "Verra VCS", "ACR", "CAR"],
    datasets: [{
      label: "Avg price ($)",
      data: [21, 18, 16, 11],
      backgroundColor: ["#1f6b42", "#2d8a57", "#94a3b8", "#cbd5e1"],
      borderWidth: 0,
    }],
  };

  const stdOpts: any = {
    ...barOpts,
    scales: {
      ...barOpts.scales,
      y: { ticks: { callback: (v: any) => `$${v}`, font: { size: 11 } }, grid: { color: "#f1f5f9" } },
    },
  };

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">Price (tCO₂)</div><div className="metric-value">${overview?.spot_price.toFixed(2) ?? "—"}</div><div className="metric-change up">▲ {overview?.change_24h}% today</div></div>
        <div className="metric-card"><div className="metric-label">7D Change</div><div className="metric-value up">+$1.80</div><div className="metric-change up">▲ 10.8%</div></div>
        <div className="metric-card"><div className="metric-label">30D High</div><div className="metric-value">$21.50</div><div className="metric-sub">Apr 3, 2026</div></div>
        <div className="metric-card"><div className="metric-label">30D Low</div><div className="metric-value">$14.20</div><div className="metric-sub">Mar 22, 2026</div></div>
      </div>

      <div className="card mb-14">
        <div className="card-header">
          <span className="card-title">Market price — Last {range}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["30D", "90D", "1Y"].map((r) => (
              <button key={r} className={`btn btn-sm ${range === r ? "btn-green" : ""}`} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
        </div>
        <div style={{ height: 220 }}>
          {prices.length > 0 && <Line data={lineData} options={lineOpts} />}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span className="card-title">Volume by project type</span></div>
          <div style={{ height: 200 }}>
            <Bar data={volumeData} options={barOpts} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {["Forest 45%", "Solar 25%", "Wind 18%", "Wetland 12%"].map((l, i) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--slate-500)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: ["#1f6b42","#2563eb","#d97706","#0ea5e9"][i], display: "inline-block" }} />
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Average price by standard</span></div>
          <div style={{ height: 200 }}>
            <Bar data={stdData} options={stdOpts} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {["Gold Std $21", "Verra VCS $18", "ACR $16", "CAR $11"].map((l, i) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--slate-500)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: ["#1f6b42","#2d8a57","#94a3b8","#cbd5e1"][i], display: "inline-block" }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
