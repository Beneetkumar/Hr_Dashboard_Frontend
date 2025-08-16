import React, { useEffect, useState } from "react";
import "./AddAttendance.css";

const API = "http://localhost:5000";

export default function AddAttendance({ onCreated, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");
  const [error, setError] = useState("");

  
  useEffect(() => {
    fetch(`${API}/api/employees?status=Present`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.items) ? d.items : [];
        setEmployees(list);
        if (list.length > 0) {
          setEmployeeId(list[0]._id); 
        }
      })
      .catch(() => setEmployees([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
     const res = await fetch(`${API}/api/attendance`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    employee: employeeId, 
    date,
    status,
  
  }),
});

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to mark attendance");

      onCreated?.(data); // refresh parent list
      onClose?.(); // close modal
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">📅 Mark Attendance</h2>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Employee (Present only)</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              {employees.length === 0 ? (
                <option value="">No present employees</option>
              ) : (
                employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half-Day">Half-Day</option>
            </select>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!employeeId || !date} // ✅ prevent empty submit
            >
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
