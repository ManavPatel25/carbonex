from db import db
from models import Project, Transaction, Portfolio

PROJECTS = [
    dict(name="Amazon Rainforest Reserve", project_type="REDD+ Forest Protection", country="Brazil",
         standard="Verra VCS", price=22.10, available=48200, status="Verified", annual_co2=48200, vintage=2023),
    dict(name="Gujarat Solar Farm", project_type="Renewable Energy", country="India",
         standard="Gold Standard", price=14.75, available=12500, status="Verified", annual_co2=12500, vintage=2024),
    dict(name="Kenya Wind Power Initiative", project_type="Wind Energy", country="Kenya",
         standard="Gold Standard", price=11.90, available=31800, status="Verified", annual_co2=31800, vintage=2024),
    dict(name="BC Blue Carbon Wetlands", project_type="Coastal Wetland", country="Canada",
         standard="ACR", price=29.50, available=6100, status="Verified", annual_co2=6100, vintage=2023),
    dict(name="Borneo Peatland Restoration", project_type="REDD+ Forest Protection", country="Indonesia",
         standard="Verra VCS", price=19.80, available=22400, status="Verified", annual_co2=22400, vintage=2023),
    dict(name="Rajasthan Cookstove Program", project_type="Clean Cooking", country="India",
         standard="CAR", price=9.20, available=88000, status="Verified", annual_co2=88000, vintage=2024),
    dict(name="Sumatra Forest Shield", project_type="REDD+ Forest Protection", country="Indonesia",
         standard="Verra VCS", price=17.40, available=5800, status="Under Review", annual_co2=5800, vintage=2024),
    dict(name="Nigeria Biomass Energy", project_type="Biomass", country="Nigeria",
         standard="CAR", price=8.10, available=3200, status="Flagged", annual_co2=3200, vintage=2022),
]

PORTFOLIO = [
    dict(project_name="Amazon Rainforest Reserve", quantity=1200, avg_price=19.40, current_price=22.10),
    dict(project_name="Gujarat Solar Farm", quantity=900, avg_price=12.80, current_price=14.75),
    dict(project_name="Kenya Wind Power Initiative", quantity=850, avg_price=13.10, current_price=11.90),
    dict(project_name="BC Blue Carbon Wetlands", quantity=500, avg_price=26.00, current_price=29.50),
]

TRANSACTIONS = [
    dict(tx_type="deposit", description="Bank Transfer Deposit", amount=50000, credits=None),
    dict(tx_type="buy", description="Bought Amazon Rainforest Reserve — 1,200 credits", amount=-23280, credits=1200),
    dict(tx_type="buy", description="Bought Gujarat Solar Farm — 900 credits", amount=-11520, credits=900),
    dict(tx_type="buy", description="Bought BC Blue Carbon Wetlands — 500 credits", amount=-13000, credits=500),
    dict(tx_type="deposit", description="Bank Transfer Deposit", amount=32000, credits=None),
    dict(tx_type="buy", description="Bought Kenya Wind Power Initiative — 850 credits", amount=-11135, credits=850),
]


def seed_db():
    if Project.query.count() == 0:
        for i, p in enumerate(PROJECTS):
            proj = Project(**p)
            db.session.add(proj)
        db.session.flush()

        projects = Project.query.all()
        proj_map = {p.name: p.id for p in projects}

        for p in PORTFOLIO:
            pid = proj_map.get(p["project_name"])
            db.session.add(Portfolio(project_id=pid, **p))

        for t in TRANSACTIONS:
            db.session.add(Transaction(**t))

        db.session.commit()
        print("✅ Database seeded.")
