from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth import auth_bp
from routes.complaints import complaint_bp
from models import db
import os

print("Starting Flask app...")

# Path to React/Vite build folder
frontend_folder = os.path.join(os.getcwd(), "../frontend/dist")

app = Flask(__name__, static_folder=frontend_folder, static_url_path="/")

CORS(app)

app.config.from_object('config.Config')
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'

db.init_app(app)
jwt = JWTManager(app)

# API routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(complaint_bp, url_prefix='/api/complaints')

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(frontend_folder, path)):
        return send_from_directory(frontend_folder, path)
    else:
        return send_from_directory(frontend_folder, "index.html")

if __name__ == "__main__":
    print("\nAvailable routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=10000)