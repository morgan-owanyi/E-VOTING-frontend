import React, { FormEvent, useState } from "react";
import logo from "../assets/kuravote-black.png";
import bg from "../assets/vote.png";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.register({
        name,
        email,
        password,
        role: "CANDIDATE" // Default to candidate for registration page
      });
      
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.email?.[0] || err.response?.data?.username?.[0] || "Registration failed");
    } finally {
      setLoading(false);
    }
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ zIndex: 2, position: "relative" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 21 }}>Kura vote</span>
              <span style={{
                display: "block", fontSize: 11,
                color: "#5d6678", fontWeight: 400, marginTop: -3,
              }}>
                Vote for Action
              </span>
            </div>
          </div>
          <div>
            <button className="btn btn-link nav-link d-inline" onClick={() => navigate('/')} style={{ marginRight: 25 }}>Home</button>
            <button className="btn btn-link nav-link d-inline" onClick={() => navigate('/login')} style={{ marginRight: 25 }}>Login</button>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", zIndex: 3, position: "relative" }}>
        <div className="card p-4" style={{
          width: 375, borderRadius: 15, boxShadow: "0 4px 32px 0 rgb(62 72 100 / 16%)"
        }}>
          <h5 className="text-center mt-2 mb-2">Candidate Registration</h5>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter your full name" 
                value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" placeholder="Choose a username" 
                value={username} onChange={e => setUsername(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" 
                value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Create your password" 
                value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ background: "#243b5c", fontWeight: 500 }} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;