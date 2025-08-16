import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaUsersCog } from "react-icons/fa";  
import "./Sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
    
      <div className="sidebar-header">
        <FaUsersCog className="sidebar-icon" />
        <h1 className="sidebar-title">HRMS</h1>
      </div>

     
      <nav className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/candidates">Candidates</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/leaves">Leaves</Link>
      </nav>

      <div className="nav-actions">
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </aside>
  );
}
