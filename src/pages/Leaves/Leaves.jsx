import React, { useEffect, useState } from "react";
import "./Leaves.css";
import AddLeave from "./AddLeave";
import { FcLeave } from "react-icons/fc";

// ✅ Use env variable instead of hardcoded localhost
const API = import.meta.env.VITE_API_URL;

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  const load = () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const url = new URL(`${API}/leaves`);
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (status) url.searchParams.set("status", status);

      fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch leaves");
          return r.json();
        })
        .then((d) => {
          setLeaves(Array.isArray(d.items) ? d.items : d);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
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

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/leaves/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setMessage(data.message || `Leave updated to ${newStatus}`);
      load();
    } catch (err) {
      console.error("Update error:", err.message);
      setError(err.message);
    }
  };

  const onFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="leaves-container">
      <div className="leaves-header">
        <h1 className="leaves-heading">
          <FcLeave /> &nbsp;Leaves
        </h1>
        <button
          className="leaves-btn-primary"
          onClick={() => setShowAdd((s) => !s)}
        >
          {showAdd ? "Close" : "Add Leave"}
        </button>
      </div>

      {showAdd && (
        <AddLeave
          onCreated={() => {
            setShowAdd(false);
            load();
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      <form className="leaves-filters" onSubmit={onFilterSubmit}>
        <input
          type="text"
          placeholder="Search by employee name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="leaves-search-input"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="leaves-select"
        >
          <option value="">Any Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="leaves-btn">
          Search
        </button>
      </form>

      {loading && <p className="leaves-loading">Loading leaves...</p>}
      {error && <p className="leaves-error">{error}</p>}
      {message && <p className="leaves-success">{message}</p>}

      {!loading && !error && (
        <>
          {leaves.length === 0 ? (
            <p className="leaves-empty">No leave records found.</p>
          ) : (
            <div className="leaves-grid">
              {leaves.map((leave) => (
                <div className="leaves-card" key={leave._id}>
                  <h3 className="leaves-card-title">
                    {leave.employee?.name || "Unknown"}
                  </h3>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`leaves-status ${leave.status?.toLowerCase()}`}
                    >
                      {leave.status}
                    </span>
                  </p>
                  <p>
                    <strong>From:</strong>{" "}
                    {leave.startDate &&
                      new Date(leave.startDate).toLocaleDateString()}
                    <br />
                    <strong>To:</strong>{" "}
                    {leave.endDate &&
                      new Date(leave.endDate).toLocaleDateString()}
                  </p>
                  {leave.docsUrl && (
                    <p>
                      <strong>Doc:</strong>{" "}
                      <a
                        href={`${API}${leave.docsUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="leaves-doc-link"
                      >
                        View
                      </a>
                    </p>
                  )}

                  {/* ✅ Only show Approve/Reject if Pending */}
                  {leave.status === "Pending" && (
                    <div className="leaves-actions">
                      <button
                        className="leaves-btn approve"
                        onClick={() => updateStatus(leave._id, "Approved")}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="leaves-btn reject"
                        onClick={() => updateStatus(leave._id, "Rejected")}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
