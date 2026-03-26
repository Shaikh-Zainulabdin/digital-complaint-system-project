import { useEffect, useState } from "react";
import "../styles/complaints.css";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/complaints/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString()
    };
  };

  if (loading) return <h2 className="center">Loading complaints...</h2>;

  return (
    <div className="complaints-page">

      <h2>My Complaints</h2>

      {complaints.length === 0 ? (
        <p className="center">No complaints submitted yet.</p>
      ) : (

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Department</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map(c => {
              const { date, time } = formatDate(c.created_at);

              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.department}</td>

                  <td>
                    <span className={`status ${c.status}`}>
                      {c.status}
                    </span>
                  </td>

                  <td>{date}</td>
                  <td>{time}</td>

                  <td>
                    <button onClick={() => setSelected(c)}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>{selected.title}</h3>
            <p><b>Department:</b> {selected.department}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p className="desc">{selected.description}</p>
            <button onClick={()=>setSelected(null)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}