import React, { useEffect, useState } from "react";
import "./Attendance.css";
import AddAttendance from "./AddAttendance";

// ✅ Use .env or fallback to deployed backend
const API =
  import.meta.env.VITE_API_URL ||
  "https://hr-dashboard-backend-99kv.onrender.com/api";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Filters
  const [empId, setEmpId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Load employees for filter dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API}/employees`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to fetch employees");

        setEmployees(Array.isArray(data.items) ? data.items : data);
      } catch (err) {
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  // ✅ Load attendance with filters
  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const url = new URL(`${API}/attendance`);
      if (empId) url.searchParams.set("employee", empId);
      if (date) url.searchParams.set("date", date);
      if (status) url.searchParams.set("status", status);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch attendance");

      setAttendance(Array.isArray(data.items) ? data.items : data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load();
  }, []);

  const onFilter = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1>📋 Attendance</h1>
        <button
          className="btn-primary"
          onClick={() => setShowAdd((prev) => !prev)}
        >
          {showAdd ? "Close Form" : "+ Mark Attendance"}
        </button>
      </div>

      {showAdd && (
        <AddAttendance onCreated={load} onClose={() => setShowAdd(false)} />
      )}

      {/* ✅ Filters */}
      <form className="filters" onSubmit={onFilter}>
        <select
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          className="select"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select"
        >
          <option value="">Any Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Half-Day">Half-Day</option>
        </select>

        <button type="submit" className="btn">Search</button>
      </form>

      {loading && <p className="loading-text">Loading attendance...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        attendance.length === 0 ? (
          <p className="empty-state">No attendance records found.</p>
        ) : (
          <div className="attendance-grid">
            {attendance.map((record) => (
              <div className="attendance-card" key={record._id}>
                <h3>{record.employee?.name || "Unknown"}</h3>
                <p><strong>Status:</strong> {record.status}</p>
                <p><strong>Date:</strong> {record.date?.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
