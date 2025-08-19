import React, { useState } from "react";
import "./AddCandidate.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AddCandidate({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setResumeFile(f || null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      if (position) formData.append("position", position);
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await fetch(`${API}/candidates`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.message ||
          (Array.isArray(data?.errors)
            ? data.errors.map((x) => x.msg || x).join(", ")
            : "Failed to add candidate");
        throw new Error(msg);
      }

      onCreated?.(data);
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to add candidate");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">📝 Add Candidate</h2>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={onFileChange} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Save Candidate</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
