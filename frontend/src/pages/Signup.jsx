import { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/main.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    email: "",
    password: "",
    role: "STUDENT",
    adminKey: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");
    setMessageType("info");
    setLoading(true);

    try {
      const res = await registerUser(form);

      if (res.message) {
        setMessage("Account created successfully! Redirecting...");
        setMessageType("success");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(res.error || "Signup failed");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Server error");
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
          
        </div>

        <div className="form-title">
          <h2>Create Account</h2>
          <p>Fill in your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {form.role === "STUDENT" && (
            <div className="input-group">
              <label>Roll Number</label>
              <div className="input-wrapper">
                <span className="input-icon">🔢</span>
                <input
                  name="roll_no"
                  placeholder="Enter your roll number"
                  value={form.roll_no}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

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
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>I am a</label>
            <div className="input-wrapper">
              <span className="input-icon">👥</span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          {form.role === "ADMIN" && (
            <div className="input-group admin-field">
              <label>Admin Key</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  name="adminKey"
                  type="password"
                  placeholder="Enter admin key"
                  value={form.adminKey}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <div className={`message-box ${messageType}`}>
            <span>{messageType === "success" ? "✅" : messageType === "error" ? "❌" : "ℹ️"}</span>
            {message}
          </div>
        )}

        <div className="features-list">
          <div className="feature-item">
            <span>✅</span> Track complaints
          </div>
          <div className="feature-item">
            <span>⚡</span> Real-time updates
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}