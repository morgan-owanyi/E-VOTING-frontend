import React, { FormEvent } from "react";
import logo from "../assets/kuravote-black.png";
import bg from "../assets/vote.png";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Implement registration logic here
    navigate("/login");
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
            <a href="/" className="nav-link d-inline" style={{ marginRight: 25 }}>Home</a>
            <a href="/login" className="nav-link d-inline" style={{ marginRight: 25 }}>Login</a>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", zIndex: 3, position: "relative" }}>
        <div className="card p-4" style={{
          width: 375, borderRadius: 15, boxShadow: "0 4px 32px 0 rgb(62 72 100 / 16%)"
        }}>
          <h5 className="text-center mt-2 mb-2">Candidate Registration</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter your full name" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Registration number</label>
              <input type="text" className="form-control" placeholder="Enter registration number" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Program</label>
              <input type="text" className="form-control" placeholder="Enter your program here" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Create your password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ background: "#243b5c", fontWeight: 500 }}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;