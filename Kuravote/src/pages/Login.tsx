import React, { useState, FormEvent } from "react";
import logo from "../assets/kuravote-black.png";
import bg from "../assets/vote.png";
import voteicon from "../assets/vote.png";
import candidate1 from "../assets/candidate1.jpg";
// Add more candidate images as needed

type Role = "admin" | "officer" | "candidate" | "voter";

interface Candidate {
  id: string;
  name: string;
  img: string;
}

interface PositionGroup {
  position: string;
  candidates: Candidate[];
}

// Demo candidate data grouped by position
const positionGroups: PositionGroup[] = [
  {
    position: "President",
    candidates: [
      { id: "1", name: "Samuel Akot", img: candidate1 },
      { id: "2", name: "Jane Doe", img: candidate1 }
    ]
  },
  // Add more positions with candidates if needed
];

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  /** For voter login flow: */
  const [voterStep, setVoterStep] = useState<"reg" | "otp" | "vote">("reg");
  const [voterRegNo, setVoterRegNo] = useState<string>("");
  const [voterOtp, setVoterOtp] = useState<string>("");
  const [selectedVotes, setSelectedVotes] = useState<{ [position: string]: string }>({});
  /** For other roles: */
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [candidateRegNo, setCandidateRegNo] = useState<string>("");

  // Handles fake "vote cast"
  const handleVote = (position: string, candidateId: string) => {
    setSelectedVotes(prev => ({ ...prev, [position]: candidateId }));
    // Demo: simulate end (single vote for presentation)
    setTimeout(() => alert("Thank you for voting!"), 1000);
  };

  // Handles main login form submit (for non-voters)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === "voter") {
      // Should not happen, as voter handled below
      return;
    }
    // Sort and route based on role, demo
    if (role === "admin") alert("Admin signed in (demo)");
    else if (role === "officer") alert("Returning Officer signed in (demo)");
    else if (role === "candidate") alert("Candidate signed in (demo)");
  };

  // Voter step 1: registration number
  const handleVoterRegSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Sort/fake eligibility then go to OTP
    setVoterStep("otp");
  };

  // Voter step 2: OTP
  const handleVoterOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Sort/fake OTP validation then go to vote
    setVoterStep("vote");
  };

  // Main UI
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
      {/* Navbar */}
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
            <a href="/" className="nav-link d-inline" style={{ marginRight: 25 }}>Home</a>
            <a href="/register" className="nav-link d-inline" style={{ marginRight: 25 }}>Register</a>
          </div>
        </div>
      </nav>
      {/* Centered Container */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", zIndex: 3, position: "relative" }}>
        <div className="card p-4" style={{
          maxWidth: role === "voter" && voterStep === "vote" ? 1100 : 420,
          width: "100%",
          borderRadius: 18,
          boxShadow: "0 2px 16px #00000022",
          margin: "0 auto"
        }}>
          {/* ROLE SELECTOR */}
          {!(role === "voter" && voterStep === "vote") && (
            <div className="mb-2 d-flex justify-content-between">
              <select
                className="form-select"
                value={role}
                onChange={e => { setRole(e.target.value as Role); setVoterStep("reg"); }}
                style={{ width: "60%" }}
              >
                <option value="admin">Admin</option>
                <option value="officer">Returning Officer</option>
                <option value="candidate">Candidate</option>
                <option value="voter">Voter</option>
              </select>
            </div>
          )}

          {/* NON-VOTER LOGINS */}
          {(role === "admin" || role === "officer" || role === "candidate") && (
            <>
              <h5 className="text-center mt-2 mb-2">
                {role === "admin" ? "Admin"
                  : role === "officer" ? "Returning Officer"
                    : "Candidate"}
              </h5>
              <div className="text-center mb-3" style={{ color: "#555" }}>Sign in to continue</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                {role === "candidate" && (
                  <div className="mb-3">
                    <label className="form-label">Registration number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter registration number"
                      value={candidateRegNo}
                      required
                      onChange={e => setCandidateRegNo(e.target.value)}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Input your password here"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit"
                  className="btn btn-primary w-100"
                  style={{ background: "#243b5c", fontWeight: 500 }}>
                  Sign In
                </button>
              </form>
            </>
          )}
          {/* VOTER FLOW */}
          {role === "voter" && voterStep === "reg" && (
            <form onSubmit={handleVoterRegSubmit}>
              <div className="text-center mb-3">
                <img src={voteicon} alt="Vote" style={{ width: 54, marginBottom: 8 }} />
                <h5 className="fw-bold mt-2">Cast your vote</h5>
                <div>
                  Input your registration number to continue
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Registration no:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your registration number here:"
                  value={voterRegNo}
                  required
                  onChange={e => setVoterRegNo(e.target.value)}
                />
              </div>
              <button type="submit" className="btn w-100" style={{
                background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18
              }}>
                Continue
              </button>
            </form>
          )}
          {role === "voter" && voterStep === "otp" && (
            <form onSubmit={handleVoterOtpSubmit}>
              <div className="text-center mb-3">
                <img src={voteicon} alt="Vote OTP" style={{ width: 54, marginBottom: 8 }} />
                <h5 className="fw-bold mt-2">Cast your vote</h5>
                <div>Input your registration number to continue</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Input OTP code:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Input OTP"
                  value={voterOtp}
                  required
                  onChange={e => setVoterOtp(e.target.value)}
                />
              </div>
              <div style={{ fontSize: 14, color: "#667", marginBottom: 7 }}>
                <b>NB:</b> <span style={{ color: "#888" }}>This code can only be used once, make your vote count!</span>
              </div>
              <div>
                <button type="button" style={{ fontSize: 14, color: "#18605e", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer" }}>Didn't receive one?</button>
              </div>
              <button type="submit" className="btn w-100 mt-2"
                style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }}>
                Continue
              </button>
            </form>
          )}
          {role === "voter" && voterStep === "vote" && (
            <div>
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
              <footer className="text-center text-white pt-3" style={{
                background: "#189092", borderRadius: "0 0 18px 18px", marginTop: 36, height: 50
              }}>
                <div style={{ fontSize: 16, paddingTop: 12 }}>© Copyright 2025 | All Rights Reserved.</div>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}