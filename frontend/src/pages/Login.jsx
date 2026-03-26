import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import "../styles/main.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Checking credentials...");
    setMessageType("info");
    setLoading(true);

    try {
      const res = await loginUser(form);

      if (res.access_token) {
       localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        
        console.log("Token stored:", localStorage.getItem("token")); // Debug
        console.log("User stored:", localStorage.getItem("user")); // Debug

        setMessage("Login successful! Redirecting..."); 
        setMessageType("success");

        setTimeout(() => {
          if (res.user.role === "ADMIN") {
            navigate("/admin/complaints");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        setMessage(res.error || "Invalid email or password");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server not responding. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="college-header">
          <div className="college-icon">
            <span>🎓</span>
          </div>
          <h1>Rajiv Gandhi Institute of Technology</h1>
          <div className="college-subtitle">RGIT Complaint Management System</div>
        </div>

        <div className="form-title">
          <h2>Welcome Back! 👋</h2>
          <p>Please login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="button-loader"></span>
                Logging in...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        {message && (
          <div className={`message-box ${messageType}`}>
            <span className="message-icon">
              {messageType === "success" ? "✅" : messageType === "error" ? "❌" : "ℹ️"}
            </span>
            {message}
          </div>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?
            <Link to="/signup"> Sign up here</Link>
          </p>
        </div>

        <div className="rit-badge" style={{ textAlign: 'center', width: '100%' }}>
          #RGIT Cares
        </div>
      </div>
    </div>
  );
  
}