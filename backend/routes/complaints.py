from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Complaint
from models import User 

complaint_bp = Blueprint('complaints', __name__)

# -----------------------------
# Create Complaint
# -----------------------------
@complaint_bp.route('/create', methods=['POST'])
@jwt_required()
def create_complaint():
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    department = data.get('department')

    if not title or not description or not department:
        return jsonify({"error": "All fields are required"}), 400

    current_user = get_jwt_identity()  # user id (string)

    complaint = Complaint(
        title=title,
        description=description,
        department=department,
        user_id=int(current_user)
    )

    db.session.add(complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint submitted successfully"
    }), 201


# -----------------------------
# View My Complaints
# -----------------------------
@complaint_bp.route('/my', methods=['GET'])
@jwt_required()
def view_my_complaints():
    current_user = get_jwt_identity()  # user id

    complaints = Complaint.query.filter_by(
        user_id=int(current_user)
    ).order_by(Complaint.created_at.desc()).all()

    complaint_list = []

    for c in complaints:
        complaint_list.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "department": c.department,
            "status": c.status,
            "created_at": c.created_at
        })

    return jsonify({
        "complaints": complaint_list
    }), 200

# -----------------------------
# Admin View All Complaints
# -----------------------------
@complaint_bp.route('/all', methods=['GET'])
@jwt_required()
def view_all_complaints():
    current_user_id = int(get_jwt_identity())

    user = User.query.get(current_user_id)

    if not user or user.role != "ADMIN":
        return jsonify({"error": "Access denied"}), 403

    complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()

    result = []

    for c in complaints:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "department": c.department,
            "status": c.status,
            "created_at": c.created_at,
            "student_id": c.user_id
        })

    return jsonify({
        "complaints": result
    }), 200
# -----------------------------
# Admin: Update Complaint Status
# -----------------------------
@complaint_bp.route('/<int:complaint_id>/status', methods=['PATCH'])
@jwt_required()
def update_complaint_status(complaint_id):
    from models import User  # import here to avoid circular import

    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    # Only admin allowed
    if user.role != "ADMIN":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ["Pending", "In Progress", "Resolved"]:
        return jsonify({"error": "Invalid status"}), 400

    complaint = Complaint.query.get(complaint_id)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    complaint.status = new_status
    db.session.commit()

    return jsonify({
        "message": "Complaint status updated",
        "complaint_id": complaint.id,
        "new_status": complaint.status
    }), 200
# -----------------------------
# Admin Complaint Stats
# -----------------------------
@complaint_bp.route('/stats', methods=['GET'])
@jwt_required()
def complaint_stats():
    from models import User  # import here to avoid circular issues

    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if user.role != "ADMIN":
        return jsonify({"error": "Access denied"}), 403

    total = Complaint.query.count()
    pending = Complaint.query.filter_by(status="Pending").count()
    resolved = Complaint.query.filter_by(status="Resolved").count()

    return jsonify({
        "total": total,
        "pending": pending,
        "resolved": resolved
    }), 200
# -----------------------------
# Admin: Delete Complaint
# -----------------------------
@complaint_bp.route('/<int:complaint_id>', methods=['DELETE'])
@jwt_required()
def delete_complaint(complaint_id):
    current_user_id = int(get_jwt_identity())

    user = User.query.get(current_user_id)

    # Only admin allowed
    if not user or user.role != "ADMIN":
        return jsonify({"error": "Access denied"}), 403

    complaint = Complaint.query.get(complaint_id)

    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    db.session.delete(complaint)
    db.session.commit()

    return jsonify({
        "message": "Complaint deleted successfully",
        "deleted_id": complaint_id
    }), 200

