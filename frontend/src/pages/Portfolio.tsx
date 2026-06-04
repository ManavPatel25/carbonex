import React, { useEffect, useState } from "react";
import { getPortfolio } from "../utils/api";

interface Holding {
  id: number;
  project_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  value: number;
  pnl: number;
  pnl_pct: number;
}

interface PortfolioData {
  total_value: number;
  total_invested: number;
  total_profit: number;
  total_cost: number;
  total_pnl: number;
  total_pnl_pct: number;
  holdings: Holding[];
  transactions: any[];
}

const Portfolio: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolio()
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page">Loading portfolio…</div>;
  if (!data) return <div className="page">Failed to load portfolio</div>;

  return (
    <div className="page">
      <h2 className="page-title">Portfolio</h2>

      {/* SUMMARY */}
      <div className="card grid">
        <div>
          <span className="label">Total Value</span>
          <p>${(data.total_value ?? 0).toFixed(2)}</p>
        </div>

        <div>
          <span className="label">Invested</span>
          <p>${(data.total_invested ?? 0).toFixed(2)}</p>
        </div>

        <div>
          <span className="label">Profit / Loss</span>
          <p
            className={
              (data.total_pnl ?? 0) >= 0 ? "text-green" : "text-red"
            }
          >
            ${(data.total_pnl ?? 0).toFixed(2)} (
            {(data.total_pnl_pct ?? 0).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* HOLDINGS */}
      <div className="card">
        <h3>Holdings</h3>

        {(data.holdings || []).length === 0 ? (
          <p>No holdings yet</p>
        ) : (
          <div className="table">
            {(data.holdings || []).map((h) => (
              <div key={h.id} className="table-row">
                <div>
                  <strong>{h.project_name}</strong>
                </div>

                <div>Qty: {h.quantity}</div>

                <div>
                  Avg: ${(h.avg_price ?? 0).toFixed(2)}
                </div>

                <div>
                  Price: ${(h.current_price ?? 0).toFixed(2)}
                </div>

                <div>
                  Value: ${(h.value ?? 0).toFixed(2)}
                </div>

                <div
                  className={
                    (h.pnl ?? 0) >= 0 ? "text-green" : "text-red"
                  }
                >
                  PnL: ${(h.pnl ?? 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;