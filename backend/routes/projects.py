from flask import Blueprint, jsonify, request
from models import Project, db

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/", methods=["GET"])
def get_projects():
    status = request.args.get("status")
    standard = request.args.get("standard")
    project_type = request.args.get("type")

    q = Project.query
    if status:
        q = q.filter_by(status=status)
    if standard:
        q = q.filter_by(standard=standard)
    if project_type:
        q = q.filter(Project.project_type.ilike(f"%{project_type}%"))

    projects = q.order_by(Project.price.desc()).all()
    return jsonify([p.to_dict() for p in projects])


@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    p = Project.query.get_or_404(project_id)
    return jsonify(p.to_dict())


@projects_bp.route("/", methods=["POST"])
def create_project():
    data = request.get_json()
    p = Project(
        name=data["name"],
        project_type=data.get("project_type", ""),
        country=data.get("country", ""),
        standard=data.get("standard", ""),
        price=float(data["price"]),
        available=int(data.get("available", 0)),
        annual_co2=int(data.get("annual_co2", 0)),
        vintage=int(data.get("vintage", 2024)),
        status="Under Review",
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201


@projects_bp.route("/<int:project_id>", methods=["PATCH"])
def update_project_status(project_id):
    p = Project.query.get_or_404(project_id)
    data = request.get_json()
    if "status" in data:
        p.status = data["status"]
    if "price" in data:
        p.price = float(data["price"])
    db.session.commit()
    return jsonify(p.to_dict())
