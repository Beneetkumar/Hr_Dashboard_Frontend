import React, { useEffect, useState } from "react";
import "./Candidates.css";
import AddCandidate from "./AddCandidate";
import { FaPersonCircleCheck } from "react-icons/fa6";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const load = () => {
    setLoading(true);
    setError("");
    try {
      const url = new URL(`${API}/candidates`);
      if (search.trim()) url.searchParams.set("search", search.trim());

      fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch candidates");
          return r.json();
        })
        .then((data) => {
          setCandidates(Array.isArray(data.items) ? data.items : data);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    } catch (err) {
      setError("Invalid search request");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const moveToEmployee = async (id) => {
    try {
      const res = await fetch(`${API}/candidates/${id}/move-to-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to move candidate");
      load();
      alert("✅ Candidate moved to Employees");
    } catch (e) {
      alert(e.message);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="candidates-page">
      <div className="candidates-header">
        <h1><FaPersonCircleCheck />&nbsp; Candidates</h1>
        <form className="search-form" onSubmit={onSearchSubmit}>
          <input
            className="search-input"
            placeholder="Search by name, email, or position"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        <button className="btn-primary" onClick={() => setShowAdd((s) => !s)}>
          {showAdd ? "Close Form" : "+ Add Candidate"}
        </button>
      </div>

      {showAdd && (
        <AddCandidate
          onCreated={() => load()}
          onClose={() => setShowAdd(false)}
        />
      )}

      {loading && <p className="loading-text">Loading candidates...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          {candidates.length === 0 ? (
            <p className="empty-state">No candidates found.</p>
          ) : (
            <div className="candidates-grid">
              {candidates.map((c) => (
                <div className="candidate-card" key={c._id}>
                  <h3>{c.name}</h3>
                  <p><strong>Email:</strong> {c.email}</p>
                  <p><strong>Position:</strong> {c.position || "-"}</p>
                  {c.resumeUrl && (
                    <p>
                      <strong>Resume:</strong>{" "}
                      <a
                        href={`${API.replace("/api","")}${c.resumeUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                      >
                        View 
                      </a>
                    </p>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={() => moveToEmployee(c._id)}
                  >
                    Move to Employee
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
