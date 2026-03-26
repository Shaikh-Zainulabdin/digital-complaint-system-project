import { useState } from "react";
import "./CreateComplaint.css";

export default function CreateComplaint() {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    title: "",
    description: "",
    department: ""
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isValid =
    form.title &&
    form.description &&
    form.department &&
    form.name &&
    form.roll;

  const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:5000/api/complaints/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        department: form.department
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setSuccess(true); // 🔥 triggers flip

    setForm({
      name: "",
      roll: "",
      title: "",
      description: "",
      department: ""
    });

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page">

      {/* LEFT SIDE FORM */}
      <div className="left">
        <h2>Submit Complaint</h2>

        <form onSubmit={handleSubmit} className="form">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="roll"
            placeholder="Roll Number"
            value={form.roll}
            onChange={handleChange}
          />

          <input
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Complaint Description"
            value={form.description}
            onChange={handleChange}
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option>IT</option>
            <option>Computer</option>
            <option>Mechanical</option>
            <option>Electronics</option>
            <option>AI&DS</option>
          </select>

         <button disabled={!isValid || loading}>
  {loading ? "Submitting..." : "Submit Complaint"}
</button>
        </form>
      </div>


      {/* RIGHT SIDE PANEL */}
      <div className={`right ${success ? "flip" : ""}`}>

        <div className="card">

         <div className="front">
  <h3>How to Write Complaint</h3>

  <ul className="tips">
    <li>Use clear title</li>
    <li>Explain issue properly</li>
    <li>Select correct department</li>
    <li>Avoid short descriptions</li>
    <li>Provide accurate details</li>
  </ul>

  <div className="example-box">
    <h4>Example Complaint</h4>

    <p><strong>Name:</strong> XYZ</p>
    <p><strong>Roll No:</strong> 123</p>
    <p><strong>Title:</strong> Wifi Not Working</p>
    <p><strong>Description:</strong> Internet not working in lab since morning.</p>
    <p><strong>Department:</strong> IT</p>
  </div>
</div>

          {/* BACK */}
          <div className="back">
            <h2>Success ✅</h2>
            <p>Your complaint has been submitted.</p>
          </div>

        </div>
      </div>
    </div>
  );
}