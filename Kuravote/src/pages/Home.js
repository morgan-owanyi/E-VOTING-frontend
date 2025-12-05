import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/kuravote-black.png"; // Path to your logo
import vote from "../assets/vote.png"; // Path to your illustrated vote sign


function Home() {
  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      {/* Top navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 21 }}>Kura vote</span>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "#5d6678",
                  fontWeight: 400,
                  marginTop: -3,
                }}
              >
                Vote for Action
              </span>
            </div>
          </div>
          <div>
            <Link to="/" className="nav-link d-inline">Home</Link>
            <Link to="/register" className="nav-link d-inline">Register</Link>
            <Link
              to="/admin"
              className="btn btn-primary"
              style={{ marginLeft: 10, borderRadius: 6 }}
            >
              Admin &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
        <div className="row w-100">
          {/* Left column */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <div className="ps-md-5 pt-5 pt-md-0">
              <h1 style={{ fontWeight: 600, fontSize: 38 }}>
                Letting your vote<br />
                <span style={{ color: "#18605e" }}>be heard</span>
              </h1>
              <Link
                to="/login"
                className="btn"
                style={{
                  background: "#243b5c",
                  color: "white",
                  fontWeight: 500,
                  fontSize: 22,
                  paddingLeft: 50,
                  paddingRight: 50,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 7,
                  marginTop: 35
                }}
              >Login</Link>
            </div>
          </div>

          {/* Right column */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <img src={vote} alt="Vote" style={{ width: "320px", maxWidth: "90%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import "bootstrap/dist/css/bootstrap.min.css";

import react from "react";
import { button, form, card} from "react-bootstrap";

const AdminLoginPage = () => {
  return (
    <div style ={{backgroundcolor: "#F3F6FB", minHeight: "100vh"}}>

      {/* Top Navbar */}
      <nav classname= "navbar navbar-expand-lg bg-whit shadow-sm py-2"></nav>
        <div classname="container d-flex justify-content-between align-items-center">

         {/* Logo Section */}
         <div classname="d-flex align-items-center">
            <img 
            src={logo} 
            alt="Kura vote" 
            style={{ height: 40px, marginRight: 10 }} />
            </div>
            <span classname="ms-2 fw-bold">Decide for Action</span>
          </div>

          {/* right menu */}
          <ul classname="navbar-nav ms-auto d-flex align-items-center gap-3">
            <li classname="nav-item">
              <a className="nav-link text-dark" href="#">Home</a>
            </li>
            <li classname="nav-item">
              <a className="nav-link text-dark" href="#">Register</a>
            </li>
            <li>
              <button 
                style={{background: "#183153", border: "none"}}
                classname="px-4 py-2">
                Admin &rarr;    
                </button>
            </li>
          </ul>
        </div>
      
      {/* Login Form */}
      <div classname="d-flex justify-content-center align-items-center py-5">
        <card classname="p-4 shadow-sm rounded-4" style={{width: "450px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", backgroundColor: "white"}}>
          <card.body>
            <h4 classname="fw-bold text-color">Admin</h4>
            <p classname="text-center text-muted mb-4">sign in to continue</p>

            <form>
              <form.group classname="mb-3">
                <form.label>Email address</form.label>
                <form.control 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-light border- py-2"/>
              </form.group>

              <form.group classname="mb-4">
                <form.label>Password</form.label>
                <form.control 
                  type="password" 
                  placeholder="Enter password" 
                  className="bg-light border- py-2"/>
              </form.group>

              <form.group classname="mb-4">
                <form.label>Password</form.label>
                <form.control 
                  type="password" 
                  placeholder="Enter password" 
                  className="bg-light border- py-2"/>
                  </form.group>

                  <button
                    type="submit"
                    className="w-100 py-2"
                    style={{background: "#183153", border: "none"}}
                  >
                    Sign in
                    </button>
            </form>
            </card.body>
        </card>
      </div>

      {/* Footer section */}
      <footer
      classname="my-5 text white"
      style={{backgroundcolor: "#005A5A", padding: "50px 0"}}>
        <div classname="container d-flex justify-content-between">

          {/* left selection */}
          <div classname="d-flex flex-column">
            <img
            src="/logo.png"
            alt="Kura Vote Logo"
            style={{height: "50px"}}
            className="mb-3"
            />

            <h5 classname="fw-bold">Additional links</h5>
            <ul classname="list-unstyled">
              <li>FAQs</li>
              <li>Voting</li>
              <li>Returning Officer</li>
              <li>Candidate</li>
              <li>Admin</li>
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h5 classname="fw-bold">Contact Info</h5>
          <ul classname="list-unstyled">
            <li>Uganda Christian University</li>
            <li>kura@gmail.com</li>
            <li>+256 772498855/+256 741155874</li>
          </ul>
        </div>

        <div classname="text-center mt-4 pt-3" style={{bordertop: "1px solid rgba(255, 255,255, 0.2)"}}>
          Copyright 2025 | All Rights Reserved.
        </div>
      </footer>

export default AdminLoginPage;

      