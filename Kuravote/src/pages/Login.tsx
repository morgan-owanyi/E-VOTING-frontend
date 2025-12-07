import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import voteicon from "../assets/vote.png";
import candidate1 from "../assets/candidate1.jpg";
import { authAPI, votingAPI, candidateAPI } from "../utils/api";

type Role = "admin" | "officer" | "candidate" | "voter";
interface Candidate { id: string; name: string; img: string; }
interface PositionGroup { position: string; candidates: Candidate[]; }

export default function Login() {
  const [role, setRole] = useState<Role>("admin");
  const [voterStep, setVoterStep] = useState<"reg" | "otp" | "vote">("reg");
  const [voterRegNo, setVoterRegNo] = useState<string>("");
  const [voterOtp, setVoterOtp] = useState<string>("");
  const [activeElection, setActiveElection] = useState<any>(null);
  const [selectedVotes, setSelectedVotes] = useState<{ [position: string]: string }>({});
  const [positionGroups, setPositionGroups] = useState<PositionGroup[]>([]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleVote = async (position: string, candidateId: string) => {
    try {
      setSelectedVotes(prev => ({ ...prev, [position]: candidateId }));
      await votingAPI.castVote({ [position]: candidateId }, voterRegNo, activeElection?.id);
      alert("Thank you for voting!");
      navigate("/");
    } catch (err: any) {
      alert("Failed to cast vote: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Map frontend roles to backend roles
      const roleMap: { [key: string]: string } = {
        admin: "ADMIN",
        officer: "PRESIDING_OFFICER",
        candidate: "CANDIDATE",
        voter: "VOTER"
      };

      await authAPI.login({
        email,
        password,
        role: roleMap[role]
      });

      // Store user data
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      // Navigate based on role
      if (role === "admin") navigate("/admin");
      else if (role === "officer") navigate("/officer");
      else if (role === "candidate") navigate("/candidate");
      else if (role === "voter") setVoterStep("reg");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVoterRegSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, get the active election
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/elections/`);
      const elections = await response.json();
      
      // Find an active election (you can add logic to filter by date or status)
      const active = elections.find((e: any) => new Date(e.election_start) <= new Date() && new Date(e.election_end) >= new Date()) || elections[0];
      
      if (!active) {
        setError("No active election found.");
        setLoading(false);
        return;
      }
      
      setActiveElection(active);
      
      await votingAPI.requestOTP(voterRegNo, active.id);
      setVoterStep("otp");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error;
      
      // Check if voter is not eligible
      if (err.response?.status === 404 || errorMessage?.toLowerCase().includes('not found') || errorMessage?.toLowerCase().includes('not eligible')) {
        setError("You are currently not eligible to vote. Eligible voters are uploaded by the admin via CSV file or single input.");
      } else {
        setError(errorMessage || "Failed to request OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoterOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await votingAPI.verifyOTP(voterRegNo, voterOtp, activeElection?.id);
      
      // Fetch approved candidates for voting
      const candidates = await candidateAPI.getAll();
      
      // Filter only approved candidates and group by position
      const approvedCandidates = candidates.filter((cand: any) => cand.status === 'approved');
      
      const grouped = approvedCandidates.reduce((acc: PositionGroup[], cand: any) => {
        const positionTitle = cand.position?.title || cand.position;
        const existing = acc.find(g => g.position === positionTitle);
        
        if (existing) {
          existing.candidates.push({
            id: cand.id,
            name: cand.user?.first_name || cand.name,
            img: cand.profile_photo || candidate1
          });
        } else {
          acc.push({
            position: positionTitle,
            candidates: [{
              id: cand.id,
              name: cand.user?.first_name || cand.name,
              img: cand.profile_photo || candidate1
            }]
          });
        }
        return acc;
      }, []);
      
      if (grouped.length === 0) {
        setError("No approved candidates available for voting at this time.");
        return;
      }
      
      setPositionGroups(grouped);
      setVoterStep("vote");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
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
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter your email"
                    value={email} required onChange={e => setEmail(e.target.value)} disabled={loading} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Input your password here"
                    value={password} required onChange={e => setPassword(e.target.value)} disabled={loading} />
                </div>
                <button type="submit" className="btn btn-primary w-100" style={{ background: "#243b5c", fontWeight: 500 }} disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
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
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Registration no:</label>
                <input type="text" className="form-control" placeholder="Enter your registration number here:"
                  value={voterRegNo} required onChange={e => setVoterRegNo(e.target.value)} disabled={loading} />
              </div>
              <button type="submit" className="btn w-100"
                style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }} disabled={loading}>
                {loading ? "Requesting OTP..." : "Continue"}
              </button>
            </form>
          )}
          {role === "voter" && voterStep === "otp" && (
            <form onSubmit={handleVoterOtpSubmit}>
              <div className="text-center mb-3">
                <img src={voteicon} alt="Vote OTP" style={{ width: 54, marginBottom: 8 }} />
                <h5 className="fw-bold mt-2">Cast your vote</h5>
                <div>Input your OTP code to continue</div>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Input OTP code:</label>
                <input type="text" className="form-control" placeholder="Input OTP"
                  value={voterOtp} required onChange={e => setVoterOtp(e.target.value)} disabled={loading} />
              </div>
              <div style={{ fontSize: 14, color: "#667", marginBottom: 7 }}>
                <b>NB:</b> <span style={{ color: "#888" }}>This code can only be used once, make your vote count!</span>
              </div>
              <button type="submit" className="btn w-100 mt-2"
                style={{ background: "#243b5c", color: "white", fontWeight: 500, fontSize: 18 }} disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
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