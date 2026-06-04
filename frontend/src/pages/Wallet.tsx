import React, { useEffect, useState } from "react";
import { getWallet, deposit } from "../utils/api";

interface Transaction {
  id: number;
  tx_type: string;
  description: string;
  amount: number;
  credits: number | null;
  created_at: string;
}

interface WalletData {
  balance: number;
  total_deposited: number;
  total_spent: number;
  total_earned: number;
  transactions: Transaction[];
}

const TX_ICON: Record<string, string> = {
  deposit: "💰", buy: "🌿", sell: "📤", retire: "♻️",
};

const Wallet: React.FC = () => {
  const [data, setData] = useState<WalletData | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const load = () => getWallet().then(setData);

  useEffect(() => { load(); }, []);

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    setDepositing(true);
    await deposit(amt);
    await load();
    setDepositing(false);
    setShowModal(false);
    setDepositAmount("");
    setToast(`$${amt.toLocaleString()} deposited successfully`);
    setTimeout(() => setToast(""), 3000);
  };

  if (!data) return <div className="loading-row">Loading wallet…</div>;

  return (
    <div style={{ position: "relative" }}>
      {toast && <div className="toast show">{toast}</div>}

      <div className="grid-2 mb-14">
        {/* Balance card */}
        <div className="card" style={{ textAlign: "center", padding: "28px 20px" }}>
          <div className="metric-label">Available Balance</div>
          <div style={{ fontSize: 32, fontWeight: 700, margin: "10px 0", fontVariantNumeric: "tabular-nums" }}>
            ${data.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
            <button className="btn btn-green" onClick={() => setShowModal(true)}>Deposit funds</button>
            <button className="btn">Withdraw</button>
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="card-header"><span className="card-title">Balance summary</span></div>
          {[
            { label: "Total deposited", val: `$${data.total_deposited.toLocaleString()}` },
            { label: "Total spent on credits", val: `-$${data.total_spent.toLocaleString()}` },
            { label: "Earned from sales", val: `+$${data.total_earned.toLocaleString()}` },
            { label: "Available balance", val: `$${data.balance.toLocaleString()}`, bold: true, green: true },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--slate-100)", fontSize: 13 }}>
              <span style={{ color: "var(--slate-500)" }}>{r.label}</span>
              <span className="mono" style={{ fontWeight: r.bold ? 700 : 500, color: r.green ? "var(--green-600)" : "var(--slate-900)" }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Transaction history</span>
          <span className="badge badge-blue">{data.transactions.length} records</span>
        </div>
        {data.transactions.length === 0 && (
          <div className="loading-row">No transactions yet.</div>
        )}
        {data.transactions.map((t) => (
          <div key={t.id} className="tx-row">
            <div className="tx-icon" style={{ background: t.tx_type === "buy" ? "var(--green-50)" : t.tx_type === "deposit" ? "#eff6ff" : "#fef2f2" }}>
              {TX_ICON[t.tx_type] ?? "💸"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{t.description}</div>
              <div style={{ fontSize: 11, color: "var(--slate-400)", marginTop: 2 }}>{t.created_at}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontWeight: 600, color: t.amount >= 0 ? "var(--green-600)" : "var(--red-500)" }}>
                {t.amount >= 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}
              </div>
              {t.credits && (
                <div style={{ fontSize: 11, color: "var(--slate-400)", marginTop: 2 }}>{t.credits} credits</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Deposit modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Deposit funds</div>
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 10000"
                value={depositAmount}
                min={1}
                onChange={(e) => setDepositAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn btn-green" style={{ flex: 1 }} onClick={handleDeposit} disabled={depositing}>
                {depositing ? "Processing…" : "Confirm deposit"}
              </button>
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
