from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from uuid import uuid4

app = Flask(__name__)
CORS(app)

# Temporary storage for prototype registrations
registrations = []


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "NxtWave Growth Dashboard API is running!",
        "status": "success"
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "growth-dashboard-api"
    })


@app.route("/api/register", methods=["POST"])
def register_student():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    college = str(data.get("college", "")).strip()
    year = str(data.get("year", "")).strip()
    referral_code = str(data.get("referral_code", "")).strip().upper()

    if not all([name, email, college, year]):
        return jsonify({
            "success": False,
            "message": "Please complete all required fields."
        }), 400

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({
            "success": False,
            "message": "Please enter a valid email address."
        }), 400

    if year not in ["Pre-final year", "Final year"]:
        return jsonify({
            "success": False,
            "message": "Select pre-final year or final year."
        }), 400

    if any(student["email"] == email for student in registrations):
        return jsonify({
            "success": False,
            "message": "This email is already registered."
        }), 409

    student = {
        "id": str(uuid4()),
        "name": name,
        "email": email,
        "college": college,
        "year": year,
        "referral_code": referral_code or "DIRECT",
        "registered_at": datetime.now().isoformat(timespec="seconds")
    }

    registrations.append(student)

    return jsonify({
        "success": True,
        "message": "Registration successful!",
        "student": student
    }), 201


@app.route("/api/registrations", methods=["GET"])
def get_registrations():
    return jsonify({
        "success": True,
        "total": len(registrations),
        "registrations": registrations
    })

@app.route("/api/ambassadors", methods=["GET"])
def get_ambassadors():
    ambassador_codes = {
        "CAMPUS01": "Campus Ambassador 1",
        "CAMPUS02": "Campus Ambassador 2",
        "TEJA01": "Campus Ambassador 3",
        "CAMPUS04": "Campus Ambassador 4",
    }

    ambassadors = []

    for code, name in ambassador_codes.items():
        count = sum(
            1 for student in registrations
            if student["referral_code"] == code
        )

        ambassadors.append({
            "name": name,
            "referral_code": code,
            "registrations": count
        })

    return jsonify({
        "success": True,
        "total_ambassadors": len(ambassadors),
        "ambassadors": ambassadors
    })



if __name__ == "__main__":
    app.run(debug=True, port=5000)