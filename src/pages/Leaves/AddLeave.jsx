import React, { useEffect, useState } from "react";
import "./AddLeave.css";

// ✅ Use environment variable instead of hardcoding
const API = import.meta.env.VITE_API_URL;

export default function AddLeave({ onCreated, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [type, setType] = useState("Sick");
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState("");

  // Load only Present employees for leave assignment
  useEffect(() => {
    fetch(`${API}/employees?status=Present`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setEmployees(Array.isArray(d.items) ? d.items : []))
      .catch(() => setEmployees([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          employee: employeeId,
          type,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.message ||
          (Array.isArray(data?.errors)
            ? data.errors.map((x) => x.msg || x).join(", ")
            : "Failed to add leave");
        throw new Error(msg);
      }

      onCreated?.(data);
      onClose?.();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">🗓️ Add Leave</h2>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Leave Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Earned">Earned</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save Leave
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
