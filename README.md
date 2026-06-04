# 🌿 CarbonEx — Carbon Credit Marketplace

A full-stack carbon credit trading platform built with **Flask** (Python backend) and **React + TypeScript** (frontend), powered by the **Anthropic Claude API** for AI-driven credit recommendations and advisory chat.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, React Router v6, Chart.js |
| Backend | Flask, Flask-SQLAlchemy, Flask-CORS |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Styling | Custom CSS (DM Sans + DM Mono) |

---

## 📁 Project Structure

```
carbonex/
├── backend/                  # Flask API
│   ├── app.py                # App factory & blueprint registration
│   ├── models.py             # SQLAlchemy models
│   ├── seed.py               # Database seed data
│   ├── requirements.txt
│   ├── .env.example
│   └── routes/
│       ├── projects.py       # GET/POST /api/projects
│       ├── orders.py         # GET/POST /api/orders
│       ├── wallet.py         # GET /api/wallet, POST /api/wallet/deposit
│       ├── market.py         # Price chart, order book, recent trades
│       └── ai.py             # Claude chat & recommender endpoints
│
└── frontend/                 # React app
    └── src/
        ├── App.tsx            # Router + layout
        ├── index.css          # Global styles
        ├── utils/
        │   └── api.ts         # Axios API client
        ├── components/
        │   ├── Sidebar.tsx
        │   └── Topbar.tsx
        └── pages/
            ├── Marketplace.tsx   # Live listings + filters
            ├── Trade.tsx         # Buy/sell form + order book
            ├── Portfolio.tsx     # Holdings + donut chart + retirement
            ├── Analytics.tsx     # Price chart + volume bars
            ├── Wallet.tsx        # Balance + transactions + deposit
            ├── Registry.tsx      # Project verification status
            └── AIAdvisor.tsx     # Claude chat + recommender
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/carbonex.git
cd carbonex
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Add your ANTHROPIC_API_KEY
python app.py
```

The Flask API runs at **http://localhost:5000**

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

The React app runs at **http://localhost:3000**

---

## 🔑 Environment Variables

Create `backend/.env`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=sqlite:///carbonex.db
SECRET_KEY=change-me-in-production
```

Get your API key at [console.anthropic.com](https://console.anthropic.com).

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 Live Marketplace | Browse verified carbon credit listings with type filters |
| 🔄 Trade | Market, limit, and stop-limit order types with TIF options |
| 📖 Order Book | Real-time bid/ask levels with depth visualization |
| 🗂 Portfolio | Holdings tracker with P&L, donut chart, retirement goal |
| 📈 Analytics | 30-day price chart, volume by type, price by standard |
| 💳 Wallet | Balance, deposit flow, full transaction history |
| 🛡 Registry | Project verification status (Verified / Under Review / Flagged) |
| 🤖 AI Advisor | Claude-powered chat + personalised credit recommender |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/` | List all projects (filterable) |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects/` | Register new project |
| GET | `/api/orders/` | List all orders |
| POST | `/api/orders/` | Place buy/sell order |
| GET | `/api/wallet/` | Get balance + transactions |
| POST | `/api/wallet/deposit` | Deposit funds |
| GET | `/api/wallet/portfolio` | Get holdings |
| GET | `/api/market/overview` | Spot price + stats |
| GET | `/api/market/chart` | 30-day price series |
| GET | `/api/market/orderbook/:id` | Order book for project |
| GET | `/api/market/trades/:id` | Recent trades |
| POST | `/api/ai/chat` | Claude advisory chat |
| POST | `/api/ai/recommend` | AI credit recommendations |

---

## 🗺 Roadmap

- [ ] User authentication (JWT)
- [ ] WebSocket live price feed
- [ ] PostgreSQL production config
- [ ] Docker Compose setup
- [ ] Stripe payment integration
- [ ] Export portfolio as PDF/CSV

---

## 📄 License

MIT
