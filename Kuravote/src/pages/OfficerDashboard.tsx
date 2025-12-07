import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import axios from "../utils/api";

type NomStatus = "approved" | "pending" | "rejected";
type Nomination = {
  id: string;
  user: {
    first_name: string;
    email: string;
  };
  position: {
    id: string;
    title: string;
  };
  program?: string;
  message: string;
  profile_photo?: string;
  manifesto?: string;
  verification_documents?: string;
  created_at: string;
  status: NomStatus;
  rejection_reason?: string;
};

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNominations();
  }, []);

  const fetchNominations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/candidates/');
      setNominations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch nominations');
      console.error('Failed to fetch nominations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Approve this candidate?')) return;
    
    try {
      await axios.post(`/candidates/${id}/approve/`);
      fetchNominations(); // Refresh list
    } catch (err: any) {
      alert('Failed to approve: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await axios.post(`/candidates/${id}/reject/`, { reason });
      fetchNominations(); // Refresh list
    } catch (err: any) {
      alert('Failed to reject: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <img src={logo} alt="Kura vote" style={{height: 38, marginRight: 10}} />
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <button className="btn btn-light fw-bold mb-2" style={{ borderBottom: "2px solid #243b5c", color: "#243b5c" }}>Nominations</button>
        <h4 style={{ fontWeight: "bold", marginBottom: "1.2rem" }}>Nominations Management</h4>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        <div className="card" style={{ borderRadius: 18, padding: "20px 32px" }}>
          <h5 className="fw-bold mb-3">Candidate Nominations</h5>
          {!loading && nominations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No nominations submitted yet.</p>
            </div>
          ) : (
            nominations.map(nom => (
              <div key={nom.id} className="mb-4 pb-3" style={{
                borderBottom: "1px solid #e0e8f3"
              }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    {nom.profile_photo && (
                      <img 
                        src={nom.profile_photo} 
                        alt={nom.user.first_name}
                        style={{ 
                          width: 50, 
                          height: 50, 
                          borderRadius: "50%", 
                          objectFit: "cover",
                          marginRight: 12,
                          border: "2px solid #e0e8f3"
                        }}
                      />
                    )}
                    <span className="fw-bold">{nom.user.first_name}</span>
                  </div>
                  <span className="badge"
                    style={{
                      background: nom.status === "approved" ? "#40CA75"
                        : nom.status === "pending" ? "#ffc107" : "#e13f3f",
                      color: "white", fontSize: 15, padding: "6px 18px", borderRadius: 10
                    }}>
                    {nom.status.charAt(0).toUpperCase() + nom.status.slice(1)}
                  </span>
                </div>
                
                <span style={{ fontSize: 13, color: "#888", marginLeft: "7px" }}>
                  Position: {nom.position.title} • {nom.user.email}
                  {nom.program && ` • ${nom.program}`}
                </span>
                
                {nom.message && (
                  <div style={{ marginLeft: 6, color: "#444", fontSize: 14, marginTop: 8 }}>
                    <strong>Statement:</strong> {nom.message}
                  </div>
                )}

                {/* Attached Files Section */}
                <div style={{ marginLeft: 6, marginTop: 10 }}>
                  <strong style={{ fontSize: 13, color: "#333" }}>Attachments:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {nom.manifesto && (
                      <a 
                        href={nom.manifesto} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                        style={{ fontSize: 12 }}
                      >
                        📄 Manifesto
                      </a>
                    )}
                    {nom.verification_documents && (
                      <a 
                        href={nom.verification_documents} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                        style={{ fontSize: 12 }}
                      >
                        🆔 Verification Documents
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ marginLeft: 6, fontSize: 12, color: "#989898", marginTop: 8 }}>
                  Submitted: {new Date(nom.created_at).toLocaleString()}
                </div>
                
                {nom.status === "rejected" && nom.rejection_reason && (
                  <div className="mt-2 p-2" style={{
                    background: "#ffecec", borderRadius: 7, color: "#e13f3f", border: "1px solid #e13f3f"
                  }}>
                    <strong>Rejection Reason:</strong> {nom.rejection_reason}
                  </div>
                )}

                {/* Action Buttons for Pending Nominations */}
                {nom.status === "pending" && (
                  <div className="mt-3 d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(nom.id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(nom.id)}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}