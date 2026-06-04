from flask import Blueprint, jsonify
import random, math

market_bp = Blueprint("market", __name__)

BASE_PRICE = 18.42

def gen_price_series(days=30):
    prices = []
    p = 14.20
    for i in range(days):
        p += random.uniform(-0.6, 0.9)
        p = max(12.0, min(24.0, p))
        prices.append(round(p, 2))
    prices[-1] = BASE_PRICE
    return prices

def gen_order_book(base, levels=5):
    asks, bids = [], []
    cum_ask, cum_bid = 0, 0
    for i in range(levels):
        q = random.randint(80, 2200)
        p = round(base + 0.05 * (levels - i), 2)
        cum_ask += q
        asks.append({"price": p, "quantity": q, "cumulative": cum_ask})
    for i in range(levels):
        q = random.randint(80, 2200)
        p = round(base - 0.05 * (i + 1), 2)
        cum_bid += q
        bids.append({"price": p, "quantity": q, "cumulative": cum_bid})
    return {"asks": asks, "bids": bids,
            "spread": round(asks[-1]["price"] - bids[0]["price"], 2),
            "spread_pct": round((asks[-1]["price"] - bids[0]["price"]) / bids[0]["price"] * 100, 2)}

def gen_recent_trades(base, count=8):
    trades = []
    for i in range(count):
        side = random.choice(["buy", "sell"])
        p = round(base + random.uniform(-0.15, 0.15), 2)
        q = random.randint(20, 300)
        trades.append({"price": p, "quantity": q, "side": side})
    return trades


@market_bp.route("/overview", methods=["GET"])
def market_overview():
    return jsonify({
        "spot_price": BASE_PRICE,
        "change_24h": 2.3,
        "volume_24h": 142000,
        "active_listings": 1284,
        "high_30d": 21.50,
        "low_30d": 14.20,
    })


@market_bp.route("/chart", methods=["GET"])
def price_chart():
    prices = gen_price_series(30)
    return jsonify({"prices": prices, "days": 30})


@market_bp.route("/orderbook/<int:project_id>", methods=["GET"])
def order_book(project_id):
    return jsonify(gen_order_book(BASE_PRICE))


@market_bp.route("/trades/<int:project_id>", methods=["GET"])
def recent_trades(project_id):
    return jsonify(gen_recent_trades(BASE_PRICE))
