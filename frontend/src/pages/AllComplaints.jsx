import React, { useEffect, useState } from "react";
import "./AllComplaints.css";
import API_BASE_URL from "../config";
const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ==============================
  // Fetch All Complaints
  // ==============================
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/complaints/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        const sorted = data.complaints.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        setComplaints(sorted);
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==============================
  // Update Complaint Status
  // ==============================
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${API_BASE_URL}/complaints/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // Delete Complaint (FIXED)
  // ==============================
  const deleteComplaint = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
       `${API_BASE_URL}/complaints/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Complaint deleted successfully");
        fetchComplaints();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // Statistics
  // ==============================
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="admin-container">

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p>{resolved}</p>
        </div>
      </div>

      {/* Complaints Table */}
      <table className="complaint-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.title}</td>
              <td>{complaint.department}</td>

              <td>
                <select
                  value={complaint.status}
                  onChange={(e) =>
                    updateStatus(complaint.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>

              <td>
                {new Date(complaint.created_at).toLocaleDateString()}
              </td>

              <td>
                <button
                  type="button"
                  className="view-btn"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  View
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteComplaint(complaint.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedComplaint.title}</h2>
            <p><strong>ID:</strong> {selectedComplaint.id}</p>
            <p><strong>Department:</strong> {selectedComplaint.department}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Description:</strong></p>
            <p>{selectedComplaint.description}</p>

            <button
              type="button"
              className="close-btn"
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllComplaints;