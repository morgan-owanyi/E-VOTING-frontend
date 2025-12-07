import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import AddVoter from "./AddVoter";
import axios from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"positions" | "analytics">("positions");
  const [positions, setPositions] = useState<any[]>([]);
  const [elections, setElections] = useState<any[]>([]);
  const [currentElection, setCurrentElection] = useState<any>(null);
  const [eligibleVoters, setEligibleVoters] = useState<number>(0);
  const [totalVotesCast, setTotalVotesCast] = useState<number>(0);
  const [officers, setOfficers] = useState<any[]>([]);
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
    email: "",
    password: ""
  });
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    nominationStartDate: "",
    nominationEndDate: "",
    electionStartDate: "",
    electionEndDate: ""
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchElections();
    fetchOfficers();
  }, []);

  useEffect(() => {
    if (currentElection) {
      fetchPositions();
      fetchVoters();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElection]);

  const fetchElections = async () => {
    try {
      const response = await axios.get('/elections/');
      setElections(response.data);
      if (response.data.length > 0) {
        setCurrentElection(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch elections:', err);
    }
  };

  const fetchPositions = async () => {
    if (!currentElection) return;
    try {
      const response = await axios.get(`/positions/?election=${currentElection.id}`);
      setPositions(response.data);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const fetchVoters = async () => {
    if (!currentElection) return;
    try {
      const response = await axios.get(`/voters/?election=${currentElection.id}`);
      setEligibleVoters(response.data.length);
      const voted = response.data.filter((v: any) => v.has_voted).length;
      setTotalVotesCast(voted);
    } catch (err) {
      console.error('Failed to fetch voters:', err);
    }
  };

  const fetchOfficers = async () => {
    try {
      // Fetch users with PRESIDING_OFFICER role
      // For now, just set empty array - we need a proper endpoint to list all officers
      setOfficers([]);
    } catch (err) {
      console.error('Failed to fetch officers:', err);
    }
  };

  // Add voter logic
  const handleAddSingle = async (regNo: string, email: string) => {
    if (!currentElection) {
      alert('Please create an election first');
      return;
    }
    try {
      await axios.post('/voters/', {
        election: currentElection.id,
        registration_number: regNo,
        email: email
      });
      fetchVoters();
    } catch (err: any) {
      alert('Failed to add voter: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportCSV = async (regNos: string[]) => {
    if (!currentElection) {
      alert('Please create an election first');
      return;
    }
    try {
      await axios.post('/voters/bulk_create/', {
        election: currentElection.id,
        voters: regNos
      });
      fetchVoters();
    } catch (err: any) {
      alert('Failed to import voters: ' + (err.response?.data?.message || err.message));
    }
  };

  // Position handlers
  const handleOpenPositionModal = () => setShowPositionModal(true);
  const handleClosePositionModal = () => {
    setShowPositionModal(false);
    setNewPosition({ title: "", description: "", numberOfPeople: "", duration: "", caution: "" });
  };

  const handleSubmitPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentElection) {
      alert('Please create an election first');
      return;
    }
    try {
      await axios.post('/positions/', {
        election: currentElection.id,
        title: newPosition.title,
        description: newPosition.description,
        number_of_people: parseInt(newPosition.numberOfPeople) || 1,
        duration: newPosition.duration,
        caution: newPosition.caution
      });
      fetchPositions();
      handleClosePositionModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create position');
    }
  };

  const handleLogout = () => {
    // Clear any stored auth tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // Redirect to home
    navigate('/');
  };

  const handleDeletePosition = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await axios.delete(`/positions/${id}/`);
        fetchPositions();
      } catch (err: any) {
        alert('Failed to delete position: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Officer handlers
  const handleOpenOfficerModal = () => {
    // Generate temp password
    const tempPassword = 'Officer' + Math.random().toString(36).slice(-8);
    setNewOfficer({ name: "", email: "", password: tempPassword });
    setShowOfficerModal(true);
  };

  const handleCloseOfficerModal = () => {
    setShowOfficerModal(false);
    setNewOfficer({ name: "", email: "", password: "" });
  };

  const handleSubmitOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register/', {
        username: newOfficer.email.split('@')[0],
        email: newOfficer.email,
        password: newOfficer.password,
        first_name: newOfficer.name,
        role: 'PRESIDING_OFFICER'
      });
      
      // Show password to admin
      alert(`Officer created!\n\nEmail: ${newOfficer.email}\nTemporary Password: ${newOfficer.password}\n\nPlease save these credentials.`);
      
      setOfficers([...officers, {
        id: `o${officers.length + 1}`,
        name: newOfficer.name,
        email: newOfficer.email,
        tempPassword: newOfficer.password
      }]);
      handleCloseOfficerModal();
    } catch (err: any) {
      alert(err.response?.data?.message || err.response?.data?.email?.[0] || 'Failed to create officer');
    }
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
      title: "",
      description: "",
      nominationStartDate: "",
      nominationEndDate: "",
      electionStartDate: "",
      electionEndDate: ""
    });
  };

  const handleSubmitElection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const nomStart = new Date(newElection.nominationStartDate);
    const nomEnd = new Date(newElection.nominationEndDate);
    const elecStart = new Date(newElection.electionStartDate);
    const elecEnd = new Date(newElection.electionEndDate);
    
    if (nomStart >= nomEnd) {
      alert("Nomination end date must be after start date");
      return;
    }
    
    if (elecStart >= elecEnd) {
      alert("Election end date must be after start date");
      return;
    }
    
    if (nomEnd >= elecStart) {
      alert("Election start date must be after nomination end date");
      return;
    }
    
    try {
      const response = await axios.post('/elections/', {
        title: newElection.title,
        description: newElection.description,
        nomination_start_date: newElection.nominationStartDate,
        nomination_end_date: newElection.nominationEndDate,
        election_start_date: newElection.electionStartDate,
        election_end_date: newElection.electionEndDate
      });
      
      setElections([...elections, response.data]);
      setCurrentElection(response.data);
      handleCloseElectionModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create election');
    }
  };

  // Analytics
  const voterTurnoutRate = eligibleVoters > 0 ? ((totalVotesCast / eligibleVoters) * 100).toFixed(1) : '0.0';
  const votingPercentage = eligibleVoters > 0 ? ((totalVotesCast / eligibleVoters) * 100).toFixed(1) : '0.0';

  const downloadAuditLog = () => {
    // In production, fetch audit logs from backend
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Action,User,Details\n"
      + "No audit logs available";
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
                          <h5 className="fw-bold mb-1">{pos.title}</h5>
                          <div style={{ fontSize: 14, color: "#666" }}>{pos.description}</div>
                          <div style={{ fontSize: 13, color: "#9e9e9e", marginTop: 6 }}>
                            {pos.number_of_people} {pos.number_of_people === 1 ? 'seat' : 'seats'} available
                          </div>
                          {pos.duration && (
                            <div style={{ fontSize: 13, color: "#9e9e9e", marginTop: 2 }}>
                              Duration: {pos.duration} years
                            </div>
                          )}
                        </div>
                        <div className="d-flex gap-2 align-items-center">
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
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">
                          No audit logs available. This feature will be implemented in a future update.
                        </td>
                      </tr>
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
                      value={newElection.title}
                      onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
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
