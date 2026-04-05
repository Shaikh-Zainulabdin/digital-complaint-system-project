from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager 
from routes.auth import auth_bp
from routes.complaints import complaint_bp
from models import db

print("Starting Flask app...")

app = Flask(__name__)
CORS(app)

app.config.from_object('config.Config')
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'

db.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(complaint_bp, url_prefix='/api/complaints')

if __name__ == "__main__":
    print("\nAvailable routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

    with app.app_context():
        db.create_all()

    app.run(debug=True)