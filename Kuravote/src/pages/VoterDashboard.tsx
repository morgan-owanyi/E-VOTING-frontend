import React, { useState } from "react";
import logo from "../assets/kuravote-black.png";
import candidate1 from "../assets/candidate1.jpg";

interface Candidate {
  id: string;
  name: string;
  img: string;
}

interface PositionGroup {
  position: string;
  candidates: Candidate[];
}

// Demo data
const positionGroups: PositionGroup[] = [
  {
    position: "President",
    candidates: [
      { id: "1", name: "Samuel Akot", img: candidate1 },
      { id: "2", name: "Jane Doe", img: candidate1 }
    ]
  }
  // Add more positions if desired
];

export default function VoterDashboard() {
  const [selectedVotes, setSelectedVotes] = useState<{ [position: string]: string }>({});

  const handleVote = (position: string, candidateId: string) => {
    setSelectedVotes(prev => ({ ...prev, [position]: candidateId }));
    setTimeout(() => alert("Thank you for voting!"), 1000);
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
        <h3 className="text-center mb-4">Cast your vote</h3>
        <div className="row">
          {positionGroups.map(group => (
            <div className="col-md-6 mb-4" key={group.position}>
              <div className="card" style={{ borderRadius: 18 }}>
                <div className="card-header text-center fw-bold fs-4" style={{ borderRadius: 18, background: "#f6f8fa" }}>{group.position}</div>
                <div className="card-body">
                  <div className="row justify-content-center">
                    {group.candidates.map(cand => (
                      <div className="col-12 text-center mb-3" key={cand.id}>
                        <div className="fw-semibold mb-2">{cand.name}</div>
                        <img src={cand.img} alt={cand.name} style={{
                          width: 180, height: 130,
                          objectFit: "cover", borderRadius: 9,
                          border: "1px solid #e3e8ef"
                        }} />
                        <button
                          className="btn btn-primary w-75 mt-3"
                          style={{ background: "#1477cb", fontWeight: 600, fontSize: 18 }}
                          disabled={!!selectedVotes[group.position]}
                          onClick={() => handleVote(group.position, cand.id)}
                        >
                          &#10003; Vote
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="text-center text-white pt-3"
          style={{ background: "#189092", borderRadius: "0 0 18px 18px", marginTop: 36, height: 50 }}>
          <div style={{ fontSize: 16, paddingTop: 12 }}>© Copyright 2025 | All Rights Reserved.</div>
        </footer>
      </div>
    </div>
  );
}