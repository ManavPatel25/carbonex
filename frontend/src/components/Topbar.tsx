import React, { useEffect, useState } from "react";
import { getMarketOverview } from "../utils/api";

const Topbar: React.FC<{ title: string }> = ({ title }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    getMarketOverview().then((d) => {
      setPrice(d.spot_price);
      setChange(d.change_24h);
    });
  }, []);

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">
        <span className="text-muted">tCO₂ spot</span>
        {price !== null && (
          <>
            <span className="spot-price">${price.toFixed(2)}</span>
            <span className={change! >= 0 ? "up" : "down"}>
              {change! >= 0 ? "▲" : "▼"} {Math.abs(change!)}%
            </span>
          </>
        )}
        <span className="live-dot" />
      </div>
    </header>
  );
};

export default Topbar;
