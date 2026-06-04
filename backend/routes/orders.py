from flask import Blueprint, jsonify, request
from models import Order, Portfolio, Transaction, Project, db

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/", methods=["GET"])
def get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@orders_bp.route("/", methods=["POST"])
def place_order():
    data = request.get_json()
    project = Project.query.get_or_404(data["project_id"])

    qty = int(data["quantity"])
    price = project.price
    total = round(qty * price, 2)

    order = Order(
        project_id=project.id,
        project_name=project.name,
        side=data["side"],
        order_type=data.get("order_type", "market"),
        quantity=qty,
        price=price,
        limit_price=data.get("limit_price"),
        stop_price=data.get("stop_price"),
        tif=data.get("tif", "GTC"),
        status="Filled",
        total=total,
    )
    db.session.add(order)

    # Update portfolio
    holding = Portfolio.query.filter_by(project_id=project.id).first()
    if data["side"] == "buy":
        if holding:
            new_qty = holding.quantity + qty
            holding.avg_price = round((holding.avg_price * holding.quantity + price * qty) / new_qty, 2)
            holding.quantity = new_qty
            holding.current_price = price
        else:
            db.session.add(Portfolio(project_id=project.id, project_name=project.name,
                                     quantity=qty, avg_price=price, current_price=price))
        project.available = max(0, project.available - qty)
        db.session.add(Transaction(tx_type="buy",
                                   description=f"Bought {project.name} — {qty} credits",
                                   amount=-total, credits=qty))
    else:
        if holding and holding.quantity >= qty:
            holding.quantity -= qty
            holding.current_price = price
            project.available += qty
        db.session.add(Transaction(tx_type="sell",
                                   description=f"Sold {project.name} — {qty} credits",
                                   amount=total, credits=qty))

    db.session.commit()
    return jsonify(order.to_dict()), 201
