from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =========================
# DATA STORAGE (IN MEMORY)
# =========================
wallet = {
    "balance": 1000,
    "total_deposited": 1000,
    "total_spent": 0,
    "total_earned": 0,
    "transactions": []
}

projects = [
    {"id": 1, "name": "Solar Energy", "price": 100, "available": 500, "standard": "Gold Standard"},
    {"id": 2, "name": "Wind Farm", "price": 80, "available": 300, "standard": "Verra"},
]

trades = []  # 🔥 store all trades


# =========================
# PROJECTS
# =========================
@app.route("/projects")
def get_projects():
    return jsonify(projects)


# =========================
# WALLET
# =========================
@app.route("/wallet")
def get_wallet():
    return jsonify(wallet)


@app.route("/wallet/deposit", methods=["POST"])
def deposit():
    amount = float(request.json.get("amount", 0))
    wallet["balance"] += amount
    wallet["total_deposited"] += amount
    return jsonify(wallet)


# =========================
# PLACE ORDER
# =========================
@app.route("/orders/", methods=["POST"])
def place_order():
    data = request.json

    project_id = data.get("project_id")
    qty = float(data.get("quantity", 0))
    side = data.get("side", "buy")

    project = next((p for p in projects if p["id"] == project_id), None)

    if not project:
        return jsonify({"error": "Project not found"}), 400

    price = project["price"]
    cost = qty * price

    if side == "buy":
        if wallet["balance"] < cost:
            return jsonify({"error": "Insufficient funds"}), 400

        wallet["balance"] -= cost
        wallet["total_spent"] += cost

    # 🔥 SAVE TRADE
    trades.append({
        "project_id": project_id,
        "project_name": project["name"],
        "quantity": qty,
        "price": price
    })

    return jsonify({"success": True})


# =========================
# PORTFOLIO (🔥 REAL FIX)
# =========================
@app.route("/wallet/portfolio")
def get_portfolio():
    holdings = {}

    for t in trades:
        pid = t["project_id"]

        if pid not in holdings:
            holdings[pid] = {
                "project_id": pid,
                "project_name": t["project_name"],
                "quantity": 0,
                "total_cost": 0
            }

        holdings[pid]["quantity"] += t["quantity"]
        holdings[pid]["total_cost"] += t["quantity"] * t["price"]

    result = []

    for h in holdings.values():
        project = next((p for p in projects if p["id"] == h["project_id"]), None)
        current_price = project["price"] if project else 0

        avg_price = h["total_cost"] / h["quantity"]
        value = h["quantity"] * current_price
        pnl = value - h["total_cost"]
        pnl_pct = (pnl / h["total_cost"]) * 100 if h["total_cost"] else 0

        result.append({
            "id": h["project_id"],
            "project_id": h["project_id"],
            "project_name": h["project_name"],
            "quantity": h["quantity"],
            "avg_price": avg_price,
            "current_price": current_price,
            "value": value,
            "pnl": pnl,
            "pnl_pct": pnl_pct,
            "profit": pnl
        })

    return jsonify({
        "total_value": sum(r["value"] for r in result),
        "total_invested": sum(h["total_cost"] for h in holdings.values()),
        "total_profit": sum(r["profit"] for r in result),
        "total_cost": sum(h["total_cost"] for h in holdings.values()),
        "total_pnl": sum(r["pnl"] for r in result),
        "total_pnl_pct": 0,
        "holdings": result,
        "transactions": trades
    })


# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)