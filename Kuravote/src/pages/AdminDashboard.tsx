import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import AddVoter from "./AddVoter";

// Demo position data
const defaultPositions: any[] = [];

const defaultOfficers: any[] = [];

const auditLogs: any[] = [];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"positions" | "analytics">("positions");
  const [positions, setPositions] = useState(defaultPositions);
  const [eligibleVoters, setEligibleVoters] = useState<number>(0);
  const totalVotesCast = 0;
  const [officers, setOfficers] = useState(defaultOfficers);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: "",
    description: "",
    numberOfPeople: "",
    duration: "",
    caution: ""
  });
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    email: ""
  });
  const [newElection, setNewElection] = useState({
    name: "",
    description: "",
    nominationStartDate: "",
    nominationEndDate: "",
    electionStartDate: "",
    electionEndDate: ""
  });

  // Add voter logic
  const handleAddSingle = (regNo: string) => setEligibleVoters(v => v + 1);
  const handleImportCSV = (regNos: string[]) => setEligibleVoters(v => v + regNos.length);

  // Position handlers
  const handleOpenPositionModal = () => setShowPositionModal(true);
  const handleClosePositionModal = () => {
    setShowPositionModal(false);
    setNewPosition({ title: "", description: "", numberOfPeople: "", duration: "", caution: "" });
  };

  const handleSubmitPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const position = {
      id: `p${positions.length + 1}`,
      name: newPosition.title,
      description: newPosition.description,
      candidatesApproved: 0,
      candidatesTotal: parseInt(newPosition.numberOfPeople) || 0,
      status: "open",
      duration: newPosition.duration,
      caution: newPosition.caution
    };
    setPositions([...positions, position]);
    handleClosePositionModal();
  };

  const handleLogout = () => {
    // Clear any stored auth tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Redirect to home
    navigate('/');
  };

  const handleDeletePosition = (id: string) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      setPositions(positions.filter(pos => pos.id !== id));
    }
  };

  // Officer handlers
  const handleOpenOfficerModal = () => setShowOfficerModal(true);
  const handleCloseOfficerModal = () => {
    setShowOfficerModal(false);
    setNewOfficer({ name: "", email: "" });
  };

  const handleSubmitOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a temporary password
    const tempPassword = 'Officer' + Math.random().toString(36).slice(-8);
    
    const officer = {
      id: `o${officers.length + 1}`,
      name: newOfficer.name,
      email: newOfficer.email,
      assignedDate: new Date().toISOString().split('T')[0],
      status: "active"
    };
    setOfficers([...officers, officer]);
    
    // Show credentials to admin (in production, this would send an email)
    alert(
      `Returning Officer Created Successfully!\n\n` +
      `Name: ${newOfficer.name}\n` +
      `Email: ${newOfficer.email}\n` +
      `Temporary Password: ${tempPassword}\n\n` +
      `IMPORTANT: Share these credentials with the officer.\n` +
      `In production, an email will be sent automatically with login instructions.`
    );
    
    handleCloseOfficerModal();
  };

  const handleDismissOfficer = (id: string) => {
    if (window.confirm("Are you sure you want to dismiss this returning officer?")) {
      setOfficers(officers.filter(off => off.id !== id));
    }
  };

  // Election handlers
  const handleOpenElectionModal = () => setShowElectionModal(true);
  const handleCloseElectionModal = () => {
    setShowElectionModal(false);
    setNewElection({ 
      name: "", 
      description: "", 
      nominationStartDate: "", 
      nominationEndDate: "", 
      electionStartDate: "", 
      electionEndDate: "" 
    });
  };

  const handleSubmitElection = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const nomStart = new Date(newElection.nominationStartDate);
    const nomEnd = new Date(newElection.nominationEndDate);
    const elecStart = new Date(newElection.electionStartDate);
    const elecEnd = new Date(newElection.electionEndDate);

    if (nomEnd <= nomStart) {
      alert("Nomination end date must be after start date");
      return;
    }
    if (elecStart <= nomEnd) {
      alert("Election start date must be after nomination period ends");
      return;
    }
    if (elecEnd <= elecStart) {
      alert("Election end date must be after start date");
      return;
    }

    alert(
      `Election "${newElection.name}" created successfully!\n\n` +
      `Nomination Period: ${newElection.nominationStartDate} to ${newElection.nominationEndDate}\n` +
      `Election Period: ${newElection.electionStartDate} to ${newElection.electionEndDate}`
    );
    handleCloseElectionModal();
  };

  // Analytics
  const voterTurnoutRate = ((totalVotesCast / eligibleVoters) * 100).toFixed(1);
  const votingPercentage = ((totalVotesCast / eligibleVoters) * 100).toFixed(1);

  const downloadAuditLog = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Action,User,Details\n"
      + auditLogs.map(log => `${log.timestamp},${log.action},${log.user},${log.details}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{height: 38, marginRight: 10}} />
            <span style={{fontWeight: 600, fontSize: 21 }}>Kura vote</span>
          </div>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      
      <div className="container mt-5">
        {/* Navigation Tabs */}
        <div className="mb-4 d-flex gap-3">
          <button 
            className={`btn fw-bold ${activeTab === "positions" ? "btn-primary" : "btn-light"}`}
            onClick={() => setActiveTab("positions")}
          >
            Positions & Voters
          </button>
          <button 
            className={`btn fw-bold ${activeTab === "analytics" ? "btn-primary" : "btn-light"}`}
            onClick={() => setActiveTab("analytics")}
          >
            Reports & Analytics
          </button>
        </div>

        {/* POSITIONS & VOTERS TAB */}
        {activeTab === "positions" && (
          <>
            {/* Action Buttons Row */}
            <div className="mb-4 d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={handleOpenPositionModal}>
                + Create Position
              </button>
              <button className="btn btn-success" onClick={handleOpenOfficerModal}>
                + Add Returning Officer
              </button>
              <button className="btn btn-info" onClick={handleOpenElectionModal}>
                + Create Election
              </button>
            </div>

            {/* Add Voters Section */}
            <div className="mb-4">
              <h5>Add Voters</h5>
              <AddVoter onAddSingle={handleAddSingle} onImportCSV={handleImportCSV} />
              <div className="mt-2">Eligible voters: <b>{eligibleVoters}</b></div>
            </div>

            {/* Returning Officers Section */}
            <div className="mb-4">
              <h4 className="fw-bold mb-3">Returning Officers</h4>
              <div className="card" style={{ borderRadius: 18, padding: "20px" }}>
                {officers.length === 0 ? (
                  <p className="text-muted">No returning officers assigned yet.</p>
                ) : (
                  officers.map(officer => (
                    <div key={officer.id} className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: "1px solid #e3e8ef" }}>
                      <div>
                        <h6 className="fw-bold mb-1">{officer.name}</h6>
                        <div style={{ fontSize: 13, color: "#666" }}>{officer.email}</div>
                        <div style={{ fontSize: 12, color: "#999" }}>Assigned: {officer.assignedDate}</div>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            const newPassword = 'Officer' + Math.random().toString(36).slice(-8);
                            alert(
                              `Password Reset for ${officer.name}\n\n` +
                              `Email: ${officer.email}\n` +
                              `New Password: ${newPassword}\n\n` +
                              `Share these credentials with the officer.\n` +
                              `They should change this password after first login.`
                            );
                          }}
                        >
                          Reset Password
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDismissOfficer(officer.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Positions Section */}
            <div className="mb-4">
              <h4 className="fw-bold mb-3">Election Positions</h4>
              <div className="card" style={{ borderRadius: 18, padding: "20px" }}>
                {positions.length === 0 ? (
                  <p className="text-muted">No positions created yet.</p>
                ) : (
                  positions.map(pos => (
                    <div key={pos.id} className="mb-4 pb-4" style={{ borderBottom: "1px solid #e3e8ef" }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-bold mb-1">{pos.name}</h5>
                          <div style={{ fontSize: 14, color: "#666" }}>{pos.description}</div>
                          <div style={{ fontSize: 13, color: "#9e9e9e", marginTop: 6 }}>
                            {pos.candidatesApproved}/{pos.candidatesTotal} candidates approved
                          </div>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <span className="badge bg-success" style={{ fontSize: 14, padding: "6px 14px", borderRadius: 10 }}>
                            {pos.status.charAt(0).toUpperCase() + pos.status.slice(1)}
                          </span>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeletePosition(pos.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* REPORTS & ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <>
            {/* Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card" style={{ borderRadius: 18, padding: "20px", background: "#e3f2fd" }}>
                  <div style={{ fontSize: 14, color: "#1976d2", fontWeight: 500 }}>Total Voters</div>
                  <h2 className="fw-bold mb-0" style={{ color: "#0d47a1" }}>{eligibleVoters}</h2>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card" style={{ borderRadius: 18, padding: "20px", background: "#e8f5e9" }}>
                  <div style={{ fontSize: 14, color: "#388e3c", fontWeight: 500 }}>Votes Cast</div>
                  <h2 className="fw-bold mb-0" style={{ color: "#1b5e20" }}>{totalVotesCast}</h2>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card" style={{ borderRadius: 18, padding: "20px", background: "#fff3e0" }}>
                  <div style={{ fontSize: 14, color: "#f57c00", fontWeight: 500 }}>Voting Percentage</div>
                  <h2 className="fw-bold mb-0" style={{ color: "#e65100" }}>{votingPercentage}%</h2>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card" style={{ borderRadius: 18, padding: "20px", background: "#f3e5f5" }}>
                  <div style={{ fontSize: 14, color: "#7b1fa2", fontWeight: 500 }}>Turnout Rate</div>
                  <h2 className="fw-bold mb-0" style={{ color: "#4a148c" }}>{voterTurnoutRate}%</h2>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Full Audit Log</h4>
                <button className="btn btn-primary" onClick={downloadAuditLog}>
                  Download CSV
                </button>
              </div>
              <div className="card" style={{ borderRadius: 18, padding: "20px" }}>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id}>
                          <td style={{ fontSize: 13 }}>{log.timestamp}</td>
                          <td><span className="badge bg-info">{log.action}</span></td>
                          <td style={{ fontSize: 13 }}>{log.user}</td>
                          <td style={{ fontSize: 13, color: "#666" }}>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CREATE POSITION MODAL */}
      {showPositionModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: 18 }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #e3e8ef" }}>
                <h5 className="modal-title fw-bold">Create New Position</h5>
                <button type="button" className="btn-close" onClick={handleClosePositionModal}></button>
              </div>
              <div className="modal-body" style={{ padding: "24px" }}>
                <form onSubmit={handleSubmitPosition}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Position Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., President, Secretary, Treasurer"
                      value={newPosition.title}
                      onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Short Description <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Brief description of the position responsibilities"
                      value={newPosition.description}
                      onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Number of People Needed <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g., 1, 2, 3"
                        min="1"
                        value={newPosition.numberOfPeople}
                        onChange={(e) => setNewPosition({ ...newPosition, numberOfPeople: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Application Closing Date & Time <span className="text-danger">*</span></label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={newPosition.duration}
                        onChange={(e) => setNewPosition({ ...newPosition, duration: e.target.value })}
                        required
                      />
                      <small className="text-muted">When the position will stop accepting candidates</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Caution to Applicants <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Important notes or warnings for candidates applying to this position"
                      value={newPosition.caution}
                      onChange={(e) => setNewPosition({ ...newPosition, caution: e.target.value })}
                      required
                    />
                    <small className="text-muted">This will be displayed to candidates during the application process</small>
                  </div>

                  <div className="alert alert-info" style={{ fontSize: 14, borderRadius: 12 }}>
                    <strong>Note:</strong> Once created, the position will be open for nominations. Make sure all details are correct before submitting.
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={handleClosePositionModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ fontWeight: 500 }}>
                      Create Position
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD RETURNING OFFICER MODAL */}
      {showOfficerModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 18 }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #e3e8ef" }}>
                <h5 className="modal-title fw-bold">Add Returning Officer</h5>
                <button type="button" className="btn-close" onClick={handleCloseOfficerModal}></button>
              </div>
              <div className="modal-body" style={{ padding: "24px" }}>
                <form onSubmit={handleSubmitOfficer}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Officer Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full name"
                      value={newOfficer.name}
                      onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="officer@example.com"
                      value={newOfficer.email}
                      onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="alert alert-warning" style={{ fontSize: 13, borderRadius: 12 }}>
                    <strong>Note:</strong> The officer will receive login credentials via email and can manage candidate approvals.
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseOfficerModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ fontWeight: 500 }}>
                      Add Officer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ELECTION MODAL */}
      {showElectionModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: 18 }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #e3e8ef" }}>
                <h5 className="modal-title fw-bold">Create New Election</h5>
                <button type="button" className="btn-close" onClick={handleCloseElectionModal}></button>
              </div>
              <div className="modal-body" style={{ padding: "24px" }}>
                <form onSubmit={handleSubmitElection}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Election Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Student Council Elections 2025"
                      value={newElection.name}
                      onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Brief description of the election"
                      value={newElection.description}
                      onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* NOMINATION PERIOD */}
                  <div className="card mb-3" style={{ background: "#e3f2fd", border: "1px solid #90caf9", borderRadius: 12 }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3" style={{ color: "#1565c0" }}>📝 Nomination Period</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Start Date & Time <span className="text-danger">*</span></label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={newElection.nominationStartDate}
                            onChange={(e) => setNewElection({ ...newElection, nominationStartDate: e.target.value })}
                            required
                          />
                          <small className="text-muted">When candidates can start applying</small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">End Date & Time <span className="text-danger">*</span></label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={newElection.nominationEndDate}
                            onChange={(e) => setNewElection({ ...newElection, nominationEndDate: e.target.value })}
                            required
                          />
                          <small className="text-muted">When nominations close</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ELECTION/VOTING PERIOD */}
                  <div className="card mb-3" style={{ background: "#e8f5e9", border: "1px solid #81c784", borderRadius: 12 }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3" style={{ color: "#2e7d32" }}>🗳️ Election/Voting Period</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Start Date & Time <span className="text-danger">*</span></label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={newElection.electionStartDate}
                            onChange={(e) => setNewElection({ ...newElection, electionStartDate: e.target.value })}
                            required
                          />
                          <small className="text-muted">When voting opens</small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">End Date & Time <span className="text-danger">*</span></label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={newElection.electionEndDate}
                            onChange={(e) => setNewElection({ ...newElection, electionEndDate: e.target.value })}
                            required
                          />
                          <small className="text-muted">When voting closes</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info" style={{ fontSize: 13, borderRadius: 12 }}>
                    <strong>Timeline:</strong> Nominations → Approval → Voting → Results
                    <br />
                    <small>Ensure nomination period ends before voting begins to allow time for candidate approval.</small>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseElectionModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ fontWeight: 500 }}>
                      Create Election
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
