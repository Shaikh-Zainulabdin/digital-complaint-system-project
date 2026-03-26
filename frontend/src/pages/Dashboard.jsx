import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeImage from "../assets/college.jpg"; 
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Left Side - College Image */}
        <div className="home-image">
          <img src={collegeImage} alt="Rajiv Gandhi Institute of Technology" />
        </div>

        {/* Right Side - Content */}
        <div className="home-text">
          <div className="welcome-message">
            <h2>Welcome, {user.name}!</h2>
            <span className="role-badge">{user.role}</span>
          </div>

          <h1>RGIT Complaint Management System</h1>
          <div className="subtitle">Rajiv Gandhi Institute of Technology</div>

          <p>
            A structured and transparent platform for students to raise concerns 
            related to academics, infrastructure, or administration. Track your 
            complaints in real-time and get quick resolutions from the college 
            authorities. Digitizing the complaint process for better accountability 
            and faster responses.
          </p>

          <div className="home-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/create")}
            >
              📝 Create Complaint
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate("/my-complaints")}
            >
              📋 View My Complaints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}