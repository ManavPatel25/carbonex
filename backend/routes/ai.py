from flask import Blueprint, jsonify, request
import requests, os

ai_bp = Blueprint("ai", __name__)

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-20250514"

SYSTEM_CHAT = """You are a carbon credit market expert advisor on CarbonEx, a carbon credit marketplace.
Help users understand carbon credits, certification standards (Gold Standard, Verra VCS, ACR, CAR),
project types (REDD+, solar, wind, blue carbon, cookstoves), pricing, additionality, permanence,
vintage, and trading strategy. Be concise, practical, and helpful. Keep responses under 180 words."""

SYSTEM_RECOMMEND = """You are a carbon credit portfolio expert. Return ONLY valid JSON, no markdown, no preamble."""


def call_claude(system, messages, max_tokens=1000):
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["x-api-key"] = api_key
        headers["anthropic-version"] = "2023-06-01"
    res = requests.post(ANTHROPIC_URL, json={
        "model": MODEL,
        "max_tokens": max_tokens,
        "system": system,
        "messages": messages,
    }, headers=headers, timeout=30)
    data = res.json()
    return data.get("content", [{}])[0].get("text", "")


@ai_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    try:
        reply = call_claude(SYSTEM_CHAT, messages)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": f"AI unavailable: {str(e)}"}), 200


@ai_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    goal = data.get("goal", "")
    cert = data.get("cert", "Any standard")
    region = data.get("region", "Global")
    projects = data.get("projects", [])

    prompt = f"""User preferences:
Goal: {goal}
Certification: {cert}
Region: {region}

Available projects: {projects}

Return exactly 3 recommendations as a JSON array:
[{{"name":"...","reason":"one sentence","score":85,"allocation":"40%","tag":"Best value"}}]
Tags: Best value | Highest quality | Best co-benefits | Most liquid | Recommended"""

    try:
        raw = call_claude(SYSTEM_RECOMMEND, [{"role": "user", "content": prompt}])
        import json, re
        raw = re.sub(r"```json|```", "", raw).strip()
        recs = json.loads(raw)
        return jsonify({"recommendations": recs})
    except Exception as e:
        return jsonify({"recommendations": [], "error": str(e)}), 200
