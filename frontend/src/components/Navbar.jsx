import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Get user and token from localStorage on component mount and when location changes
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    setToken(storedToken);
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
        setUser(null);
      }
    }
  }, [location]); // Re-run when route changes to ensure navbar updates

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
    
    // Navigate to login
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Don't render navbar if no token
  if (!token) {
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      {/* Left Section - Logo */}
      <div className="nav-left">
        <h3>RGIT Complaints</h3>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Center Section - Navigation Links */}
      <div className={`nav-center ${mobileMenuOpen ? "open" : ""}`}>
        {user?.role === "ADMIN" ? (
          // Admin Links
          <Link 
            to="/admin/AllComplaints" 
            className={`admin-link ${isActive("/admin/AllComplaints") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Admin Dashboard
          </Link>
        ) : (
          // Student Links
          <>
            <Link 
              to="/dashboard" 
              className={`dashboard-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className={`create-link ${isActive("/create") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              Create Complaint
            </Link>
            <Link 
              to="/my-complaints" 
              className={`complaints-link ${isActive("/my-complaints") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              My Complaints
            </Link>
          </>
        )}
      </div>

      {/* Right Section - User Info & Logout */}
      <div className="nav-right">
        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role || "STUDENT"}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}