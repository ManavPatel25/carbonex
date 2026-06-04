import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Marketplace from "./pages/Marketplace";
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import Analytics from "./pages/Analytics";
import Wallet from "./pages/Wallet";
import Registry from "./pages/Registry";
import AIAdvisor from "./pages/AIAdvisor";
import "./index.css";

const TITLES: Record<string, string> = {
  "/": "Live Marketplace",
  "/trade": "Trade — Buy & Sell Credits",
  "/portfolio": "My Portfolio",
  "/analytics": "Market Analytics",
  "/wallet": "Wallet & Transactions",
  "/registry": "Project Registry",
  "/advisor": "AI Credit Advisor",
};

const Layout: React.FC<{ path: string; children: React.ReactNode }> = ({ path, children }) => (
  <div className="app">
    <Sidebar />
    <div className="main">
      <Topbar title={TITLES[path] ?? "CarbonEx"} />
      <div className="content">{children}</div>
    </div>
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout path="/"><Marketplace /></Layout>} />
      <Route path="/trade" element={<Layout path="/trade"><Trade /></Layout>} />
      <Route path="/portfolio" element={<Layout path="/portfolio"><Portfolio /></Layout>} />
      <Route path="/analytics" element={<Layout path="/analytics"><Analytics /></Layout>} />
      <Route path="/wallet" element={<Layout path="/wallet"><Wallet /></Layout>} />
      <Route path="/registry" element={<Layout path="/registry"><Registry /></Layout>} />
      <Route path="/advisor" element={<Layout path="/advisor"><AIAdvisor /></Layout>} />
    </Routes>
  </BrowserRouter>
);

export default App;
