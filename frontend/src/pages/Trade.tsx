import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProjects,
  getOrderBook,
  getRecentTrades,
  placeOrder
} from "../utils/api";

interface Project {
  id: number;
  name: string;
  price: number;
  available: number;
  standard: string;
}

interface OBLevel {
  price: number;
  quantity: number;
  cumulative: number;
}

interface OrderBook {
  bids: OBLevel[];
  asks: OBLevel[];
  spread: number;
  spread_pct: number;
}

const Trade: React.FC = () => {
  const [params] = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);

  const [qty, setQty] = useState(1);
  const [placing, setPlacing] = useState(false);

  // ✅ LOAD PROJECTS (FIXED — NO FILTERING)
  useEffect(() => {
    getProjects().then((ps: Project[]) => {
      setProjects(ps);

      const pid = params.get("project");
      const initial = pid ? ps.find((p) => p.id === +pid) : ps[0];

      if (initial) {
        setSelectedId(initial.id);
      }
    });
  }, [params]);

  const selected = projects.find((p) => p.id === selectedId);

  // ✅ REFRESH ORDER BOOK
  const refreshBook = useCallback(() => {
    if (!selectedId) return;

    getOrderBook(selectedId).then(setOrderBook);
    getRecentTrades(selectedId).then(setRecentTrades);
  }, [selectedId]);

  useEffect(() => {
    refreshBook();
  }, [refreshBook]);

  // ✅ PLACE ORDER
  const handleTrade = async () => {
    if (!selected) return;

    setPlacing(true);

    try {
      await placeOrder({
        project_id: selected.id,
        quantity: qty,
        side: "buy"
      });

      alert("Order placed!");
      refreshBook();
    } catch {
      alert("Order failed");
    }

    setPlacing(false);
  };

  return (
    <div className="page">
      <h2 className="page-title">Trade</h2>

      {/* ✅ PROJECT SELECT */}
      <div className="card">
        <label className="label">Select Project</label>

        <select
          className="input"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ PROJECT DETAILS */}
      {selected && (
        <div className="card">
          <h3>{selected.name}</h3>

          <div className="grid">
            <div>
              <span className="label">Price</span>
              <p>${(selected.price ?? 0).toFixed(2)}</p>
            </div>

            <div>
              <span className="label">Available</span>
              <p>{(selected.available ?? 0).toLocaleString()}</p>
            </div>

            <div>
              <span className="label">Standard</span>
              <p>{selected.standard || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ORDER BOOK */}
      <div className="card">
        <h3>Order Book</h3>

        <div className="grid">
          <div>
            <h4>Bids</h4>
            {(orderBook?.bids || []).map((b, i) => (
              <div key={i}>
                {b.price} — {b.quantity}
              </div>
            ))}
          </div>

          <div>
            <h4>Asks</h4>
            {(orderBook?.asks || []).map((a, i) => (
              <div key={i}>
                {a.price} — {a.quantity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ ORDER BOX */}
      <div className="card">
        <label className="label">Quantity</label>

        <input
          className="input"
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />

        <button
          className="btn primary"
          onClick={handleTrade}
          disabled={placing}
        >
          {placing ? "Placing..." : "Buy"}
        </button>
      </div>
    </div>
  );
};

export default Trade;