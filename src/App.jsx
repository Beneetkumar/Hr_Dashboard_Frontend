import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Candidates from "./pages/Candidates/Candidates";
import Employees from "./pages/Employees/Employees";
import Attendance from "./pages/Attendance/Attendance";
import Leaves from "./pages/Leaves/Leaves";
import Register from "./pages/Register/Register";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./Sidebar/Sidebar";
import "./App.css";

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldShowSidebar = user && !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      {shouldShowSidebar && <Sidebar />}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/candidates"
            element={user ? <Candidates /> : <Navigate to="/login" />}
          />
          <Route
            path="/employees"
            element={user ? <Employees /> : <Navigate to="/login" />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaves"
            element={user ? <Leaves /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
}
