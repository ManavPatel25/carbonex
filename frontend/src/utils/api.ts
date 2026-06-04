import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000"
});

/* =========================
   PROJECTS
========================= */
export const getProjects = () =>
  Promise.resolve([
    {
      id: 1,
      name: "Solar Energy",
      price: 100,
      volume: 5000,
      market_cap: 100000,
      change_24h: 2.5,
      available: 500,
      standard: "Gold Standard",

      // 🔥 REQUIRED FIELDS (fixes your error)
      project_type: "Renewable Energy",
      country: "India",
      annual_co2: 10000,
      status: "Active",
      vintage: 2023
    },
    {
      id: 2,
      name: "Wind Farm",
      price: 80,
      volume: 3000,
      market_cap: 80000,
      change_24h: -1.2,
      available: 300,
      standard: "Verra",

      // 🔥 REQUIRED FIELDS
      project_type: "Wind Energy",
      country: "Brazil",
      annual_co2: 8000,
      status: "Active",
      vintage: 2022
    }
  ]);

/* =========================
   WALLET
========================= */
export const getWallet = () =>
  api.get("/wallet").then((r) => r.data);

export const deposit = (amount: number) =>
  api.post("/wallet/deposit", { amount }).then((r) => r.data);

/* =========================
   TRADE
========================= */
export const placeOrder = (data: any) =>
  api.post("/orders/", data).then((r) => r.data);

/* =========================
   MARKET (MOCK)
========================= */
export const getMarketOverview = () =>
  Promise.resolve({
    spot_price: 100,
    change_24h: 2.5,
    volume_24h: 50000,
    active_listings: 120
  });

export const getPriceChart = () =>
  Promise.resolve({
    prices: [80, 90, 100, 110]
  });

/* =========================
   PORTFOLIO (MOCK)
========================= */
export const getPortfolio = () =>
  api.get("/wallet/portfolio").then((r) => r.data);

/* =========================
   ORDER BOOK (FIXED)
========================= */
export const getOrderBook = (projectId: number) =>
  Promise.resolve({
    bids: [],
    asks: [],
    spread: 0.5,
    spread_pct: 0.5
  });

export const getRecentTrades = (projectId: number) =>
  Promise.resolve([]);

/* =========================
   AI (FIXED)
========================= */
export const aiChat = (messages: any[]) =>
  Promise.resolve({
    reply: "AI not connected yet"
  });

export const aiRecommend = (payload: any) =>
  Promise.resolve({
    recommendations: []
  });