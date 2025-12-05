import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/kuravote-black.png";
import voteImg from "../assets/vote.png";

const Home: React.FC = () => (
  <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
    <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{boxShadow: "0 2px 4px rgba(0,0,0,.03)"}}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Kura vote" style={{ height: 38, marginRight: 10 }} />
          <div>
            <span style={{ fontWeight: 600, fontSize: 21 }}>Kura vote</span>
            <span style={{ display: "block", fontSize: 11, color: "#5d6678", fontWeight: 400, marginTop: -3 }}>
              Vote for Action
            </span>
          </div>
        </div>
        <div>
          <Link to="/" className="nav-link d-inline" style={{ marginRight: 25 }}>Home</Link>
          <Link to="/register" className="nav-link d-inline" style={{ marginRight: 25 }}>Register</Link>
          <Link to="/login" className="btn btn-primary" style={{ marginLeft: 10, borderRadius: 6 }}>Admin &rarr;</Link>
        </div>
      </div>
    </nav>
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="row w-100">
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <div className="ps-md-5 pt-5 pt-md-0">
            <h1 style={{fontWeight: 600, fontSize: 38}}>
              Letting your vote<br/><span style={{ color: "#18605e" }}>be heard</span>
            </h1>
            <Link to="/login" className="btn" style={{
              background: "#243b5c", color: "white", fontWeight: 500, fontSize: 22,
              paddingLeft: 50, paddingRight: 50, paddingTop: 10, paddingBottom: 10,
              borderRadius: 7, marginTop: 35
            }}>Login</Link>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={voteImg} alt="Vote" style={{ width: "320px", maxWidth: "90%" }} />
        </div>
      </div>
    </div>
  </div>
);

export default Home;