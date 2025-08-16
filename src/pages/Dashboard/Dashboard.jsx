import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { BiSolidDashboard } from "react-icons/bi";
import { Link } from "react-router-dom";
const API = "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    candidates: 0,
    employees: 0,
    attendance: 0,
    leaves: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [cand, emp, att, leave] = await Promise.all([
          fetch(`${API}/api/candidates`, { credentials: "include" }).then((res) => res.json()),
          fetch(`${API}/api/employees`, { credentials: "include" }).then((res) => res.json()),
          fetch(`${API}/api/attendance`, { credentials: "include" }).then((res) => res.json()),
          fetch(`${API}/api/leaves`, { credentials: "include" }).then((res) => res.json()),
        ]);

        setStats({
          candidates: Array.isArray(cand.items) ? cand.items.length : Array.isArray(cand) ? cand.length : 0,
          employees: Array.isArray(emp.items) ? emp.items.length : Array.isArray(emp) ? emp.length : 0,
          attendance: Array.isArray(att.items) ? att.items.length : Array.isArray(att) ? att.length : 0,
          leaves: Array.isArray(leave.items) ? leave.items.length : Array.isArray(leave) ? leave.length : 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title"><BiSolidDashboard />&nbsp;Dashboard</h1>
      <div className="dashboard-grid">
        <Link to ="/candidates" className="stat-card candidates">
          <h3>Candidates</h3>
          <p>{stats.candidates}</p>
        </Link>
        <Link to="/employees" className="stat-card employees">
          <h3>Employees</h3>
          <p>{stats.employees}</p>
        </Link>
        <Link to ="/attendance" className="stat-card attendance">
          <h3>Attendance</h3>
          <p>{stats.attendance}</p>
        </Link>
        <Link to ='/leaves' className="stat-card leaves">
          <h3>Leaves</h3>
          <p>{stats.leaves}</p>
        </Link>
      </div>
    </div>
  );
}
