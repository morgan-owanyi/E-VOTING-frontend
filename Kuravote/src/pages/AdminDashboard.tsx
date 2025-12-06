import React, { useState } from "react";
import logo from "../assets/kuravote-black.png";
import AddVoter from "./AddVoter";

// Demo position data (Admin only)
const defaultPositions = [
  { id: "p1", name: "President", description: "Lead the student body", candidatesApproved: 2, candidatesTotal: 3, status: "open" },
  { id: "p2", name: "Vice President", description: "Support the president", candidatesApproved: 1, candidatesTotal: 3, status: "open" },
  { id: "p3", name: "Speaker", description: "Manage communications", candidatesApproved: 0, candidatesTotal: 2, status: "open" }
];

export default function AdminDashboard() {
  const [positions, setPositions] = useState(defaultPositions);
  const [eligibleVoters, setEligibleVoters] = useState<number>(215);

  // Add voter logic for button/CVS file
  const handleAddSingle = (regNo: string) => setEligibleVoters(v => v + 1);
  const handleImportCSV = (regNos: string[]) => setEligibleVoters(v => v + regNos.length);

  // Dummy functions for creating position/election:
  const handleCreatePosition = () => {
    const newPosition = { id: `p${positions.length+1}`, name: `New Position ${positions.length+1}`, description: "Description here", candidatesApproved: 0, candidatesTotal: 0, status: "open" };
    setPositions([...positions, newPosition]);
  };

  

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{height: 38, marginRight: 10}} />
            <span style={{fontWeight: 600, fontSize: 21 }}>Kura vote</span>
          </div>
          <button className="btn btn-primary">Logout &rarr;</button>
        </div>
      </nav>
      <div className="container mt-5">
        {/* Navigation Pill */}
        <div className="mb-3 d-flex gap-4">
          <button className="btn btn-light fw-bold" style={{ borderBottom: "2px solid #243b5c", color: "#243b5c" }}>Positions</button>
          <button className="btn btn-light fw-bold">Voter verification</button>
          <button className="btn btn-light fw-bold">Reports and Dashboard</button>
        </div>

        {/* Add voter functionalities */}
        <div className="mb-4">
          <h5>Add Voters</h5>
          <AddVoter onAddSingle={handleAddSingle} onImportCSV={handleImportCSV} />
          <div className="mt-2">Eligible voters: <b>{eligibleVoters}</b></div>
        </div>

        {/* Manage positions */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="fw-bold">Election Positions</h4>
            <button className="btn btn-primary" style={{ borderRadius: 20, padding: "8px 24px", fontWeight: 500 }}
              onClick={handleCreatePosition}
            >
              + Create Position
            </button>
          </div>
          <div className="card" style={{ borderRadius: 18, padding: "16px 32px" }}>
            {positions.map(pos => (
              <div key={pos.id} className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0">{pos.name}</h5>
                    <div style={{ fontSize: 14, color: "#666" }}>{pos.description}</div>
                  </div>
                  <span className="badge bg-success" style={{ fontSize: 15, padding: "6px 16px", borderRadius: 12 }}>
                    {pos.status.charAt(0).toUpperCase() + pos.status.slice(1)}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#9e9e9e", marginTop: 6 }}>
                  {pos.candidatesApproved}/{pos.candidatesTotal} candidates approved
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Additional analytics and reports can be built as separate cards/components! */}
      </div>
    </div>
  );
}