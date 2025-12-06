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
  const [showModal, setShowModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: "",
    description: "",
    numberOfPeople: "",
    duration: "",
    caution: ""
  });

  // Add voter logic for button/CVS file
  const handleAddSingle = (regNo: string) => setEligibleVoters(v => v + 1);
  const handleImportCSV = (regNos: string[]) => setEligibleVoters(v => v + regNos.length);

  // Open modal for creating position
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPosition({
      title: "",
      description: "",
      numberOfPeople: "",
      duration: "",
      caution: ""
    });
  };

  // Handle form submission
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
    handleCloseModal();
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
              onClick={handleOpenModal}
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

      {/* Create Position Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ borderRadius: 18 }}>
                <div className="modal-header" style={{ borderBottom: "1px solid #e3e8ef" }}>
                  <h5 className="modal-title fw-bold">Create New Position</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
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
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
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
        </>
      )}
    </div>
  );
}