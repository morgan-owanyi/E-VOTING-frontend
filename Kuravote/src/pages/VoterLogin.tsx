import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import bg from "../assets/vote_bg.jpg";
import voteicon from "../assets/elections.png"; // Use vote icon for OTP card
import candidate1 from "../assets/candidate1.jpg";
// Add more candidate images as needed

interface Candidate {
  id: string;
  name: string;
  img: string;
}

interface PositionGroup {
  position: string;
  candidates: Candidate[];
}

// Mock data for demonstration, replace with API call when backend is ready
const positionGroups: PositionGroup[] = [
  {
    position: "President",
    candidates: [
      { id: "1", name: "Samuel Akot", img: candidate1 },
      { id: "2", name: "John Doe", img: candidate1 }
    ]
  },
  // Add more groups as needed
];

export default function VoterLogin() {
  const [currentStep, setCurrentStep] = useState<"reg" | "otp" | "vote">("reg");
  const [regNo, setRegNo] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [selectedVotes, setSelectedVotes] = useState<{[position: string]: string}>({});
  const navigate = useNavigate();

  // Step 1: Registration number submit
  const handleRegSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep("otp");
  };

  // Step 2: OTP submit
  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep("vote");
  };

  // Step 3: Casting vote
  const handleVote = (position: string, candidateId: string) => {
    setSelectedVotes(prev => ({ ...prev, [position]: candidateId }));
    // Add logic for submitting vote if doing one at a time
  };

  // End session on full vote (in MVP or presentation, just mock a thank you message)
  const handleSessionEnd = () => {
    // Submit all votes, clear session, redirect, etc.
    alert("Thank you for voting!");
    navigate("/");
  };

  return (
    <div style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      minHeight: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0, left: 0, zIndex: 0
    }}>
      <div style={{
        position: "absolute", minHeight: "100vh", width: "100vw",
        background: "rgba(245,245,245,0.92)", zIndex: 1, top: 0, left: 0
      }}></div>
      {/* Top NavBar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)", zIndex: 2, position: "relative" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 21 }}>Kura vote</span>
              <span style={{ display: "block", fontSize: 11, color: "#5d6678", fontWeight: 400, marginTop: -3 }}>
                Vote for Action
              </span>
            </div>
          </div>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Workflow Card */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", zIndex: 3, position: "relative" }}>
        {currentStep === "reg" && (
          <div className="card p-4" style={{ maxWidth: 420, width: "100%", borderRadius: 18, boxShadow: "0 2px 16px #00000022" }}>
            <div className="text-center mb-3">
              <img src={voteicon} alt="Vote" style={{ width: 54, marginBottom: 8 }} />
              <h5 className="fw-bold mt-2">Cast your vote</h5>
              <div>
                Input your registration number to continue
              </div>
            </div>
            <form onSubmit={handleRegSubmit}>
              <div className="mb-3">
                <label className="form-label">Registration no:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your registration number here:"
                  value={regNo}
                  required
                  onChange={e => setRegNo(e.target.value)}
                />
              </div>
              <button type="submit" className="btn w-100" style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }}>
                Continue
              </button>
            </form>
          </div>
        )}

        {currentStep === "otp" && (
          <div className="card p-4" style={{ maxWidth: 420, width: "100%", borderRadius: 18, boxShadow: "0 2px 16px #00000022" }}>
            <div className="text-center mb-3">
              <img src={voteicon} alt="Vote OTP" style={{ width: 54, marginBottom: 8 }} />
              <h5 className="fw-bold mt-2">Cast your vote</h5>
              <div>Input your registration number to continue</div>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-3">
                <label className="form-label">Input OTP code:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Input OTP"
                  value={otp}
                  required
                  onChange={e => setOtp(e.target.value)}
                />
              </div>
              <div style={{ fontSize: 14, color: "#667", marginBottom: 7 }}>
                <b>NB:</b> <span style={{ color: "#888" }}>This code can only be used once, make your vote count!</span>
              </div>
              <div>
                <button type="button" style={{ fontSize: 14, color: "#18605e", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Didn't receive one?</button>
              </div>
              <button type="submit" className="btn w-100 mt-2" style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }}>
                Continue
              </button>
            </form>
          </div>
        )}

        {currentStep === "vote" && (
          <div style={{
            width: "100%",
            maxWidth: 1100, margin: "0 auto",
            background: "#fff",
            borderRadius: 28,
            boxShadow: "0 2px 24px #00000013",
            padding: "3rem 2rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 200px)"
          }}>
            <div style={{ flex: 1 }}>
              <h3 className="text-center mb-4">Cast your vote</h3>
              <div className="row">
                {positionGroups.map(group => (
                  <div className="col-md-6 mb-4" key={group.position}>
                    <div className="card" style={{ borderRadius: 18 }}>
                      <div className="card-header text-center fw-bold fs-4" style={{ borderRadius: "18px 18px 0 0", background: "#f6f8fa" }}>{group.position}</div>
                      <div className="card-body">
                        <div className="row justify-content-center">
                          {group.candidates.map(cand => (
                            <div className="col-6 text-center mb-3" key={cand.id}>
                              <div className="fw-semibold mb-2">{cand.name}</div>
                              <img src={cand.img} alt={cand.name} style={{
                                width: "100%", maxWidth: 180, height: 130,
                                objectFit: "cover", borderRadius: 9,
                                border: "1px solid #e3e8ef"
                              }} />
                              <button
                                className="btn btn-primary w-100 mt-3"
                                style={{ background: "#1477cb", fontWeight: 600, fontSize: 16 }}
                                disabled={!!selectedVotes[group.position]}
                                onClick={() => {
                                  handleVote(group.position, cand.id);
                                  setTimeout(handleSessionEnd, 1000);
                                }}
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
            </div>
            <footer className="text-center text-white" style={{ background: "#189092", borderRadius: "0 0 28px 28px", padding: "16px 0", marginTop: "auto" }}>
              <div style={{fontSize: 14}}>© Copyright 2025 | All Rights Reserved.</div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}