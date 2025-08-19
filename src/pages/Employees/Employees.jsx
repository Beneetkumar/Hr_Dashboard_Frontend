import React, { useEffect, useState } from "react";
import "./Employees.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Load employees
  const load = () => {
    setLoading(true);
    setError("");

    try {
      const url = new URL(`${API}/employees`);
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (status) url.searchParams.set("status", status);

      fetch(url.toString(), {
        method: "GET",
        credentials: "include", // ✅ send cookies with request
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch employees");
          return res.json();
        })
        .then((data) => {
          setEmployees(Array.isArray(data.items) ? data.items : data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Something went wrong");
          setLoading(false);
        });
    } catch (err) {
      setError("Invalid filter request");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="employees-page">
      <h1 className="employees-title">👨‍💼 Employees</h1>

      <form className="filters" onSubmit={onFilterSubmit}>
        <input
          type="text"
          placeholder="Search by name, email, or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select"
        >
          <option value="">Any Status</option>
          <option value="Present">Present</option>
          <option value="Probation">Probation</option>
          <option value="Left">Left</option>
        </select>
        <button type="submit" className="btn">Search</button>
      </form>

      {loading && <p className="loading-text">Loading employees...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          {employees.length === 0 ? (
            <p className="empty-state">No employees found.</p>
          ) : (
            <div className="employees-grid">
              {employees.map((emp) => (
                <div className="employee-card" key={emp._id}>
                  <h3>{emp.name}</h3>
                  <p><strong>Email:</strong> {emp.email}</p>
                  <p><strong>Role:</strong> {emp.role}</p>
                  <p><strong>Status:</strong> {emp.employmentStatus}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
