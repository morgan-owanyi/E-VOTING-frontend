import React, { useState } from "react";
import logo from "../assets/kuravote-black.png";

type Position = {
  id: string;
  name: string;
  description: string;
  status: "open" | "closed";
};

const openPositions: Position[] = [
  { id: "p1", name: "President", description: "Lead the student body", status: "open" },
  { id: "p2", name: "Vice President", description: "Support the president", status: "open" },
  { id: "p3", name: "Speaker", description: "Manage communications", status: "open" }
];

export default function CandidateDashboard() {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Nomination submitted for "${selectedPosition}" with message: "${message}". Returning officer notified (demo).`
    );
    setSelectedPosition("");
    setMessage("");
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
          <button className="btn btn-primary">Logout &rarr;</button>
        </div>
      </nav>
      <div className="container mt-5">
        <h3 className="fw-bold mb-4">Apply for Open Positions</h3>
        <form className="card p-4 mb-4" style={{ maxWidth: 500, margin: "0 auto" }} onSubmit={handleApply}>
          <div className="mb-3">
            <label className="form-label">Select Position</label>
            <select
              className="form-select"
              value={selectedPosition}
              onChange={e => setSelectedPosition(e.target.value)}
              required
            >
              <option value="">-- select --</option>
              {openPositions.map(pos =>
                <option key={pos.id} value={pos.name}>{pos.name}</option>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Why are you applying/manifesto?</label>
            <textarea
              className="form-control"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              required
              placeholder="Write a message or brief manifesto"
            />
          </div>
          <button className="btn btn-success w-100">Submit Nomination</button>
        </form>
      </div>
    </div>
  );
}