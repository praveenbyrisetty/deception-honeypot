from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import json
import datetime
import os

app = Flask(__name__)
CORS(app)  # Allow React frontend to call our API

ALERTS_FILE = 'honey_alerts.json'


# ─────────────────────────────────────────────
#  CORE ENGINE: Alert Logger
# ─────────────────────────────────────────────
def log_alert(request_obj, severity="high"):
    """
    Captures all metadata from incoming malicious requests
    and saves them to honey_alerts.json.
    """
    alert_entry = {
        "id": int(datetime.datetime.now().timestamp() * 1000),
        "timestamp": str(datetime.datetime.now()),
        "ip_address": request_obj.remote_addr,
        "method": request_obj.method,
        "path": request_obj.path,
        "user_agent": request_obj.headers.get('User-Agent', 'Unknown'),
        "payload": request_obj.form.to_dict() if request_obj.form else (request_obj.get_json(silent=True) or {}),
        "severity": severity
    }

    # Load existing alerts
    if not os.path.exists(ALERTS_FILE):
        alerts = []
    else:
        with open(ALERTS_FILE, 'r') as f:
            try:
                alerts = json.load(f)
            except (json.JSONDecodeError, ValueError):
                alerts = []

    alerts.append(alert_entry)

    # Save updated alerts
    with open(ALERTS_FILE, 'w') as f:
        json.dump(alerts, f, indent=4)

    print(f"[ALERT] {severity.upper()} -- {request_obj.method} {request_obj.path} from {request_obj.remote_addr}")
    return alert_entry


# ─────────────────────────────────────────────
#  HONEYPOT TRAP ROUTES
# ─────────────────────────────────────────────

# 1. Fake Login Page Trap
@app.route('/login', methods=['GET', 'POST'])
def honey_login():
    if request.method == 'POST':
        log_alert(request, severity="critical")
        return jsonify({"error": "Invalid credentials. This incident has been logged."}), 403
    # GET requests just show the React frontend; we don't serve HTML from Flask
    return jsonify({"message": "Login portal active"}), 200


# 2. Dummy Admin API Traps
@app.route('/admin/config', methods=['GET', 'POST'])
@app.route('/api/v1/users', methods=['GET'])
def honey_api():
    log_alert(request, severity="high")
    return jsonify({"error": "unauthorized", "message": "Admin token required"}), 401


# 3. Hidden File Traps (Vulnerability scanners target these)
@app.route('/.env')
@app.route('/secret')
@app.route('/credentials.txt')
@app.route('/backup.zip')
@app.route('/wp-admin')
def hidden_files():
    log_alert(request, severity="critical")
    return jsonify({"error": "Access Forbidden"}), 403


# 4. Robots.txt — attackers always check this first
@app.route('/robots.txt')
def robots():
    # We intentionally disallow secret paths to bait scanners
    return (
        "User-agent: *\n"
        "Disallow: /.env\n"
        "Disallow: /secret\n"
        "Disallow: /credentials.txt\n"
        "Disallow: /backup.zip\n"
        "Disallow: /admin/config\n"
        "Disallow: /api/v1/users\n"
    ), 200, {'Content-Type': 'text/plain'}


# ─────────────────────────────────────────────
#  DASHBOARD API — for React to consume
# ─────────────────────────────────────────────

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Returns all captured honeypot alerts to the React dashboard."""
    if not os.path.exists(ALERTS_FILE):
        return jsonify([])
    with open(ALERTS_FILE, 'r') as f:
        try:
            alerts = json.load(f)
        except (json.JSONDecodeError, ValueError):
            alerts = []
    # Return newest first
    return jsonify(list(reversed(alerts)))


@app.route('/api/alerts/stats', methods=['GET'])
def get_stats():
    """Returns summary statistics for the dashboard header cards."""
    if not os.path.exists(ALERTS_FILE):
        return jsonify({"total": 0, "critical": 0, "high": 0, "unique_ips": 0})

    with open(ALERTS_FILE, 'r') as f:
        try:
            alerts = json.load(f)
        except (json.JSONDecodeError, ValueError):
            alerts = []

    unique_ips = len(set(a.get("ip_address", "") for a in alerts))
    critical = sum(1 for a in alerts if a.get("severity") == "critical")
    high = sum(1 for a in alerts if a.get("severity") == "high")

    return jsonify({
        "total": len(alerts),
        "critical": critical,
        "high": high,
        "unique_ips": unique_ips
    })


@app.route('/api/alerts/clear', methods=['DELETE'])
def clear_alerts():
    """Clears all alerts — only for demo/testing purposes."""
    with open(ALERTS_FILE, 'w') as f:
        json.dump([], f)
    return jsonify({"message": "All alerts cleared."})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
