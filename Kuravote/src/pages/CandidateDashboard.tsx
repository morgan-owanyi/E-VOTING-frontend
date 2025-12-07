import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";

type Position = {
  id: string;
  name: string;
  description: string;
  status: "open" | "closed";
};

const openPositions: Position[] = [];

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [message, setMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [manifesto, setManifesto] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleManifestoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManifesto(e.target.files[0]);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(e.target.files);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!profilePhoto) {
      alert("Please upload your profile photo");
      return;
    }
    if (!manifesto) {
      alert("Please upload your manifesto");
      return;
    }
    if (!program.trim()) {
      alert("Please enter your program of study");
      return;
    }
    if (!documents || documents.length === 0) {
      alert("Please upload at least one verification document (Student ID or National ID)");
      return;
    }

    // In production, this would send files to backend via FormData
    const formData = new FormData();
    formData.append('position', selectedPosition);
    formData.append('program', program);
    formData.append('message', message);
    formData.append('profilePhoto', profilePhoto);
    formData.append('manifesto', manifesto);
    if (documents) {
      Array.from(documents).forEach((doc, index) => {
        formData.append(`document_${index}`, doc);
      });
    }

    alert(
      `Nomination submitted for "${selectedPosition}".\n` +
      `Program: ${program}\n` +
      `Profile Photo: ${profilePhoto.name}\n` +
      `Manifesto: ${manifesto.name}\n` +
      `Verification Documents: ${documents ? documents.length : 0}\n` +
      `Returning officer notified (demo).`
    );
    
    // Reset form
    setSelectedPosition("");
    setProgram("");
    setMessage("");
    setProfilePhoto(null);
    setManifesto(null);
    setDocuments(null);
    // Reset file inputs
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <h3 className="fw-bold mb-4">Apply for Open Positions</h3>
        <form className="card p-4 mb-4" style={{ maxWidth: 600, margin: "0 auto" }} onSubmit={handleApply}>
          
          {/* Position Selection */}
          <div className="mb-3">
            <label className="form-label fw-bold">Select Position <span className="text-danger">*</span></label>
            <select
              className="form-select"
              value={selectedPosition}
              onChange={e => setSelectedPosition(e.target.value)}
              required
            >
              <option value="">-- select position --</option>
              {openPositions.map(pos =>
                <option key={pos.id} value={pos.name}>{pos.name}</option>
              )}
            </select>
          </div>

          {/* Program of Study */}
          <div className="mb-3">
            <label className="form-label fw-bold">Program of Study <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={program}
              onChange={e => setProgram(e.target.value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
              required
            />
            <small className="form-text text-muted">
              Enter your current program/course of study
            </small>
          </div>

          {/* Profile Photo Upload */}
          <div className="mb-3">
            <label className="form-label fw-bold">Profile Photo <span className="text-danger">*</span></label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              required
            />
            <small className="form-text text-muted">
              Upload a professional photo (JPG, PNG). Max 5MB
            </small>
            {profilePhoto && (
              <div className="mt-2 text-success">
                <i className="bi bi-check-circle"></i> {profilePhoto.name}
              </div>
            )}
          </div>

          {/* Manifesto Upload */}
          <div className="mb-3">
            <label className="form-label fw-bold">Manifesto <span className="text-danger">*</span></label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={handleManifestoChange}
              required
            />
            <small className="form-text text-muted">
              Upload your manifesto (PDF, DOC, DOCX). Max 10MB
            </small>
            {manifesto && (
              <div className="mt-2 text-success">
                <i className="bi bi-check-circle"></i> {manifesto.name}
              </div>
            )}
          </div>

          {/* Message/Brief Manifesto */}
          <div className="mb-3">
            <label className="form-label fw-bold">Brief Statement <span className="text-danger">*</span></label>
            <textarea
              className="form-control"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Write a brief statement about why you're applying (200-500 words)"
            />
            <small className="form-text text-muted">
              {message.length} characters
            </small>
          </div>

          {/* Supporting Documents */}
          <div className="mb-4">
            <label className="form-label fw-bold">Verification Documents <span className="text-danger">*</span></label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleDocumentsChange}
              required
            />
            <small className="form-text text-muted">
              Upload verification documents: Student ID, National ID, or any official identification (Required)
            </small>
            {documents && documents.length > 0 && (
              <div className="mt-2">
                <strong>{documents.length} file(s) selected:</strong>
                <ul className="mb-0 mt-1">
                  {Array.from(documents).map((doc, idx) => (
                    <li key={idx} className="text-success">{doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="btn btn-success w-100" style={{ padding: "12px", fontSize: "16px", fontWeight: 500 }}>
            Submit Nomination
          </button>
        </form>
      </div>
    </div>
  );
}