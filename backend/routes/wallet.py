from flask import Blueprint, jsonify, request
from models import Transaction, Portfolio, db
import random, math

wallet_bp = Blueprint("wallet", __name__)


@wallet_bp.route("/", methods=["GET"])
def get_wallet():
    txs = Transaction.query.order_by(Transaction.created_at.desc()).all()
    balance = sum(t.amount for t in txs)
    total_deposited = sum(t.amount for t in txs if t.tx_type == "deposit")
    total_spent = sum(abs(t.amount) for t in txs if t.tx_type == "buy")
    total_earned = sum(t.amount for t in txs if t.tx_type == "sell")
    return jsonify({
        "balance": round(balance, 2),
        "total_deposited": round(total_deposited, 2),
        "total_spent": round(total_spent, 2),
        "total_earned": round(total_earned, 2),
        "transactions": [t.to_dict() for t in txs],
    })


@wallet_bp.route("/deposit", methods=["POST"])
def deposit():
    data = request.get_json()
    amount = float(data.get("amount", 0))
    tx = Transaction(tx_type="deposit", description="Manual Deposit", amount=amount)
    db.session.add(tx)
    db.session.commit()
    return jsonify(tx.to_dict()), 201


@wallet_bp.route("/portfolio", methods=["GET"])
def get_portfolio():
    holdings = Portfolio.query.filter(Portfolio.quantity > 0).all()
    total_value = sum(h.quantity * h.current_price for h in holdings)
    total_cost = sum(h.quantity * h.avg_price for h in holdings)
    return jsonify({
        "holdings": [h.to_dict() for h in holdings],
        "total_value": round(total_value, 2),
        "total_cost": round(total_cost, 2),
        "total_pnl": round(total_value - total_cost, 2),
        "total_pnl_pct": round((total_value - total_cost) / total_cost * 100, 2) if total_cost else 0,
    })
