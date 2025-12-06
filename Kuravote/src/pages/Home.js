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


import "bootstrap/dist/css/bootstrap.min.css";
import react from "react";
import { button, badge, card} from "react-bootstrap";

const positionData =[
  {
    title: "President",
    description: "Lead the student body",
    approved:2,
    total:3,
    status:"Open",
  },
  {
    title: "Vice President",
    description: "Support the president",
    approved:1,
    total:3,
    status:"Open",
  },
  {
    title: "Secretary",
    description: "Manage records and communication",
    approved:0,
    total:2,
    status:"Closed",
  },
];

const PositionPage =() => {
  return (
    <div classname="container py-4">

      {/* header */}
      <div classname="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 classname="fw-bold">Voter Positions</h4>
          <p className="text-muted">Manage voter positions</p>
        </div>

        <button classname="px-4 py-2" style={{background: "#183153"}}>
          <span classname="me-2 fs-5"></span>Create Position
        </button>
      </div>
    </div>

    {/* card container */}
    <card classname="shadow-sm rounded-4 border-0">
      <card.body classname="p-0">
        <h5 classname="fw-bold px-4 pt-4">Election Positions</h5>

        {positionsData.map((position, index) => (
          <div
            key={index}
            classname="border-top px-4 py-3 d-flex flex-column"
            style={{backgroundcolor: "#fff"}}>
              <div classname="d-flex justify-content-between align-items-center">
                <h6 classname="fw-semibold mb-0">{position.title}</h6>
                <badge bg="success" classname="px-3 py-1">
                  {position.status}
                </badge>
              </div>

              <p classname="text-muted mb-1">{position.description}</p>
              <small classname="text-muted">
                {position.approved}/{position.total} candidates approved
              </small>
            </div>
        ))
      </card.body>
    </card>
  );
};


npm install bootstrap Chart.js react-chartjs-2
import "bootstrap/dist/css/bootstrap.min.css";

import react from "react";
import { card, button, dropdown, progressbar} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {chart as chartjs, categoryscale, linearscale, barelement, tooltip, legend} from "chart.js";

chartjs.register(categoryscale, linearscale, barelement, tooltip, legend);

const reportsdashboard= () => {
  const voterTurnOutData = {
    labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "14:00", "16:00", "17:00"],
    datasets: [
      {
        label: "votes",
        data: [12, 28, 45, 67, 89, 103, 118, 142, 163],
      },
      },
    ],
  };
};

return (
  <div classname="container py-4" style={{background: "#3f6fb"}}>

    {/* navbar */}
    <nav classname="navbar navbar-expand-lg bg-white shadow-sm py-2 mb-4">
      <div classname="container">
        <div classname="navbar-brand fw-bold d-flex align-items-center">
          <img src="/logo.png" alt="Kura Vote Logo" style={{height: "40px"}}/>
          <span classname="ms-2">KuraVote</span>
  </div>

  <ul classname="navbar-nav ms-auto d-flex align-items-center">
    <li classname="nav-item mx-2">Positions</li>
    <li classname="nav-item mx-2">Voter insights</li>
    <li classname="nav-item mx-2 fw-bold text-primary">Reports and Dashboard</li>
    <li>
      <button classname="ms-3 px-4" style={{background: "#183153", border: "none"}}>
        Logout &rarr;
      </button>
    </li>
  </ul>
</div>
</nav>

{/* KPI CARDS */}
<div classname="d-flex gap-3 flex-wrap mb-4">
  <card classname="shadow-sm p-3 rounded-4" style={{width: "230px"}}>
    <h5 classname="text-success fw-bold">215</h5>
    <small classname="text-muted">Eligible voters</small>
  </card>

  <card classname="shadow-sm p-3 rounded-4" style={{width: "230px"}}>
    <h5 classname="fw-bold">97</h5>
    <small classname="text-muted">Voters cast</small>
  </card>

  <card classname="shadow-sm p-3 rounded-4" style={{width: "230px"}}>
    <h5 classname="fw-bold">65%</h5>
    <small classname="text-muted">Turnout rate</small>
  </card>

  <card classname="shadow-sm p-3 rounded-4" style={{width: "230px"}}>
    <h5 classname="fw-bold">5</h5>
    <small classname="text-muted">Invalid voters</small>
  </card>
</div>

{/* filters and export */}
<div classname="d-flex justify-content-end align-items-center mb-3 gap-3">
  <dropdown>
    <dropdown.toggle classname="px-4" style={{background: "#fff", color: "#000"}}>
      All
    </dropdown.toggle>
    <dropdown.menu>
      <dropdown.item>All</dropdown.item>
      <dropdown.item>President</dropdown.item>
      <dropdown.item>Vice President</dropdown.item>
    </dropdown.menu>
    </dropdown>

    <button classname="px-4 py-2" style={{background: "#183153", border: "none"}}>
      export
    </button>
</div>
    )
      