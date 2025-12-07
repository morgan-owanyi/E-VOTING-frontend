import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import axios from "../utils/api";

type Position = {
  id: string;
  title: string;
  description: string;
  number_of_people: number;
};

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [program, setProgram] = useState<string>("");
  const [message, setMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [manifesto, setManifesto] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/positions/');
      setPositions(response.data);
    } catch (err: any) {
      console.error('Failed to fetch positions:', err);
    }
  };

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
    if (e.target.files && e.target.files[0]) {
      setDocuments(e.target.files[0]);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedPosition) {
      alert("Please select a position");
      return;
    }
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
    if (!documents) {
      alert("Please upload verification documents");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('position', selectedPosition);
      formData.append('program', program);
      formData.append('message', message);
      formData.append('profile_photo', profilePhoto);
      formData.append('manifesto', manifesto);
      formData.append('verification_documents', documents);

      await axios.post('/candidates/apply/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Application submitted successfully! Awaiting officer approval. You will be logged out.');
      
      // Clear auth data and redirect to home
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
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
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form className="card p-4 mb-4" style={{ maxWidth: 600, margin: "0 auto" }} onSubmit={handleApply}>
          
          {/* Position Selection */}
          <div className="mb-3">
            <label className="form-label fw-bold">Select Position <span className="text-danger">*</span></label>
            <select
              className="form-select"
              value={selectedPosition}
              onChange={e => setSelectedPosition(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">-- select position --</option>
              {positions.map(pos =>
                <option key={pos.id} value={pos.id}>{pos.title}</option>
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
              disabled={loading}
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
              disabled={loading}
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
              onChange={handleDocumentsChange}
              required
              disabled={loading}
            />
            <small className="form-text text-muted">
              Upload verification document: Student ID, National ID, or any official identification (Required)
            </small>
            {documents && (
              <div className="mt-2 text-success">
                <i className="bi bi-check-circle"></i> {documents.name}
              </div>
            )}
          </div>

          <button className="btn btn-success w-100" style={{ padding: "12px", fontSize: "16px", fontWeight: 500 }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Nomination'}
          </button>
        </form>
      </div>
    </div>
  );
}