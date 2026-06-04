from db import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    project_type = db.Column(db.String(100))
    country = db.Column(db.String(100))
    standard = db.Column(db.String(50))
    price = db.Column(db.Float, nullable=False)
    available = db.Column(db.Integer, default=0)
    status = db.Column(db.String(30), default="Verified")
    annual_co2 = db.Column(db.Integer, default=0)
    vintage = db.Column(db.Integer, default=2024)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "project_type": self.project_type,
            "country": self.country,
            "standard": self.standard,
            "price": self.price,
            "available": self.available,
            "status": self.status,
            "annual_co2": self.annual_co2,
            "vintage": self.vintage,
        }


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    project_name = db.Column(db.String(200))
    side = db.Column(db.String(10))        # buy | sell
    order_type = db.Column(db.String(20))  # market | limit | stop
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)
    limit_price = db.Column(db.Float, nullable=True)
    stop_price = db.Column(db.Float, nullable=True)
    tif = db.Column(db.String(10), default="GTC")
    status = db.Column(db.String(20), default="Filled")
    total = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_name": self.project_name,
            "side": self.side,
            "order_type": self.order_type,
            "quantity": self.quantity,
            "price": self.price,
            "limit_price": self.limit_price,
            "stop_price": self.stop_price,
            "tif": self.tif,
            "status": self.status,
            "total": self.total,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M"),
        }


class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    tx_type = db.Column(db.String(20))  # deposit | buy | sell | retire
    description = db.Column(db.String(300))
    amount = db.Column(db.Float)
    credits = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "tx_type": self.tx_type,
            "description": self.description,
            "amount": self.amount,
            "credits": self.credits,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M"),
        }


class Portfolio(db.Model):
    __tablename__ = "portfolio"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    project_name = db.Column(db.String(200))
    quantity = db.Column(db.Integer, default=0)
    avg_price = db.Column(db.Float)
    current_price = db.Column(db.Float)

    def to_dict(self):
        value = self.quantity * self.current_price
        cost = self.quantity * self.avg_price
        return {
            "id": self.id,
            "project_id": self.project_id,
            "project_name": self.project_name,
            "quantity": self.quantity,
            "avg_price": self.avg_price,
            "current_price": self.current_price,
            "value": round(value, 2),
            "pnl": round(value - cost, 2),
            "pnl_pct": round((value - cost) / cost * 100, 2) if cost else 0,
        }
