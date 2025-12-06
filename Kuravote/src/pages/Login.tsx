import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import voteicon from "../assets/vote.png";
import candidate1 from "../assets/candidate1.jpg";

type Role = "admin" | "officer" | "candidate" | "voter";
interface Candidate { id: string; name: string; img: string; }
interface PositionGroup { position: string; candidates: Candidate[]; }

const positionGroups: PositionGroup[] = [
  { position: "President", candidates: [
    { id: "1", name: "Samuel Akot", img: candidate1 },
    { id: "2", name: "Jane Doe", img: candidate1 }
  ] }
];

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  const [voterStep, setVoterStep] = useState<"reg" | "otp" | "vote">("reg");
  const [voterRegNo, setVoterRegNo] = useState<string>("");
  const [voterOtp, setVoterOtp] = useState<string>("");
  const [selectedVotes, setSelectedVotes] = useState<{ [position: string]: string }>({});
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [candidateRegNo, setCandidateRegNo] = useState<string>("");

  const navigate = useNavigate();

  const handleVote = (position: string, candidateId: string) => {
    setSelectedVotes(prev => ({ ...prev, [position]: candidateId }));
    setTimeout(() => {
      alert("Thank you for voting!");
      navigate("/");
    }, 1000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === "admin")  { navigate("/admin"); }
    else if (role === "officer") { navigate("/officer"); }
    else if (role === "candidate") { navigate("/candidate"); }
    else if (role === "voter") { setVoterStep("reg"); }
  };

  const handleVoterRegSubmit = (e: FormEvent) => {
    e.preventDefault();
    setVoterStep("otp");
  };

  const handleVoterOtpSubmit = (e: FormEvent) => {
    e.preventDefault();
    setVoterStep("vote");
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh", width: "100vw" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
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
            <Link to="/" className="nav-link d-inline" style={{ marginRight: 25 }}>Home</Link>
            <Link to="/register" className="nav-link d-inline" style={{ marginRight: 25 }}>Register</Link>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
        <div className="card p-4"
          style={{ maxWidth: role === "voter" && voterStep === "vote" ? 1100 : 420, width: "100%", borderRadius: 18, boxShadow: "0 2px 16px #00000022", margin: "0 auto" }}>
          
          {/* ROLE SELECTOR (hide in vote view for voter) */}
          {(role !== "voter" || voterStep !== "vote") && (
            <div className="mb-2 d-flex justify-content-between">
              <select className="form-select" value={role}
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
                {role === "admin" ? "Admin" : role === "officer" ? "Returning Officer" : "Candidate"}
              </h5>
              <div className="text-center mb-3" style={{ color: "#555" }}>Sign in to continue</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter your email"
                    value={email} required onChange={e => setEmail(e.target.value)} />
                </div>
                {role === "candidate" && (
                  <div className="mb-3">
                    <label className="form-label">Registration number</label>
                    <input type="text" className="form-control" placeholder="Enter registration number"
                      value={candidateRegNo} required onChange={e => setCandidateRegNo(e.target.value)} />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Input your password here"
                    value={password} required onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100" style={{ background: "#243b5c", fontWeight: 500 }}>
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
                <div>Input your registration number to continue</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Registration no:</label>
                <input type="text" className="form-control" placeholder="Enter your registration number here:"
                  value={voterRegNo} required onChange={e => setVoterRegNo(e.target.value)} />
              </div>
              <button type="submit" className="btn w-100"
                style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }}>
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
                <input type="text" className="form-control" placeholder="Input OTP"
                  value={voterOtp} required onChange={e => setVoterOtp(e.target.value)} />
              </div>
              <div style={{ fontSize: 14, color: "#667", marginBottom: 7 }}>
                <b>NB:</b> <span style={{ color: "#888" }}>This code can only be used once, make your vote count!</span>
              </div>
              <div>
                <Link to="#" style={{ fontSize: 14, color: "#18605e", textDecoration: "underline" }}>Didn't receive one?</Link>
              </div>
              <button type="submit" className="btn w-100 mt-2"
                style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }}>
                Continue
              </button>
            </form>
          )}
          {role === "voter" && voterStep === "vote" && (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "70vh" }}>
              <div style={{ flex: 1 }}>
                <h3 className="text-center mb-4 fw-bold">Cast your vote</h3>
                <div className="row">
                  {positionGroups.map(group => (
                    <div className="col-md-6 mb-4" key={group.position}>
                      <div className="card" style={{ borderRadius: 18, border: "1px solid #e3e8ef" }}>
                        <div className="card-header text-center fw-bold fs-5"
                          style={{ borderRadius: "18px 18px 0 0", background: "#f6f8fa", padding: "12px" }}>{group.position}</div>
                        <div className="card-body" style={{ padding: "20px" }}>
                          <div className="row">
                            {group.candidates.map(cand => (
                              <div className="col-6 text-center mb-3" key={cand.id}>
                                <div className="fw-semibold mb-2" style={{ fontSize: 15 }}>{cand.name}</div>
                                <img src={cand.img} alt={cand.name} style={{
                                  width: "100%", maxWidth: 160, height: 120, objectFit: "cover", borderRadius: 9, border: "1px solid #e3e8ef"
                                }} />
                                <button className="btn btn-primary mt-3"
                                  style={{ background: "#1477cb", fontWeight: 600, fontSize: 15, padding: "8px 20px", width: "100%", maxWidth: 160 }}
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
              </div>
              <footer className="text-center text-white"
                style={{ background: "#189092", borderRadius: "0 0 18px 18px", padding: "14px 0", marginTop: "auto" }}>
                <div style={{ fontSize: 14 }}>© Copyright 2025 | All Rights Reserved.</div>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}