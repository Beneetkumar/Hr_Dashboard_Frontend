import React, { useEffect, useState } from "react";
import "./AddAttendance.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://hr-dashboard-backend-99kv.onrender.com/api";

export default function AddAttendance({ onCreated, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch employees list
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API}/employees`, {
          credentials: "include", // send cookie-based JWT
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load employees");

        const list = Array.isArray(data.items) ? data.items : data;
        setEmployees(list);

        // auto-select first employee
        if (list.length > 0) {
          setEmployeeId(list[0]._id);
        }
      } catch (err) {
        setError(err.message);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Handle submit
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ensures auth cookie is sent
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">📅 Mark Attendance</h2>

        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <form onSubmit={submit}>
            {/* Employee Select */}
            <div className="form-group">
              <label>Employee</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                {employees.length === 0 ? (
                  <option value="">No employees found</option>
                ) : (
                  employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date Picker */}
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Status Select */}
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Present">Present ✅</option>
                <option value="Absent">Absent ❌</option>
                <option value="Half-Day">Half-Day ⏳</option>
              </select>
            </div>

            {/* Error message */}
            {error && <p className="error-text">{error}</p>}

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={!employeeId || !date}
              >
                Save
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
