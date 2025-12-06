import React from "react";
import logo from "../assets/kuravote-black.png";
type NomStatus = "approved" | "pending" | "rejected";
type Nomination = {
  id: string;
  name: string;
  email: string;
  position: string;
  message: string;
  submitted: string;
  reviewed: string;
  status: NomStatus;
  rejectReason?: string;
};

const demoNominations: Nomination[] = [
  {
    id: "1",
    name: "Samuel Akot",
    email: "samuelakot@gmail.com",
    position: "President",
    message: "I will bring positive changes to our university.",
    submitted: "05/11/2025, 9:30AM",
    reviewed: "07/11/2025, 10:00AM",
    status: "approved"
  },
  {
    id: "2",
    name: "Barberie Racheal",
    email: "barberieracheal31@gmail.com",
    position: "Vice President",
    message: "Upholding student talent as a key initiative",
    submitted: "11/11/2025, 10:30AM",
    reviewed: "12/11/2025, 5:00PM",
    status: "pending"
  },
  {
    id: "3",
    name: "Wasike John",
    email: "wasikejohn01@gmail.com",
    position: "President",
    message: "Committed to transparency and accountability",
    submitted: "15/11/2025, 1:30PM",
    reviewed: "16/11/2025, 9:00AM",
    status: "rejected",
    rejectReason: "Incomplete document submission"
  }
];

export default function Nominations() {
  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.03)" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src={logo} alt="Kura vote" style={{height: 38, marginRight: 10}} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 21 }}>Kura vote</span>
              <span style={{
                display: "block", fontSize: 11,
                color: "#5d6678", fontWeight: 400, marginTop: -3
              }}>
                Decide for Action
              </span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ borderRadius: 6 }}>Logout &rarr;</button>
        </div>
      </nav>
      <div className="container mt-5">
        <button className="btn btn-light fw-bold mb-2" style={{ borderBottom: "2px solid #243b5c", color: "#243b5c" }}>Nominations</button>
        <h4 style={{ fontWeight: "bold", marginBottom: "1.2rem" }}>Nominations Management</h4>
        <div className="card" style={{ borderRadius: 18, padding: "20px 32px" }}>
          <h5 className="fw-bold mb-3">Candidate Nominations</h5>
          {demoNominations.map(nom => (
            <div key={nom.id} className="mb-4 pb-2" style={{
              borderBottom: "1px solid #e0e8f3"
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{nom.name}</span>
                  <span style={{ fontSize: 13, color: "#888", marginLeft: "7px" }}>
                    Position: {nom.position} . {nom.email}
                  </span>
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
              <div style={{ marginLeft: 6, color: "#444", fontSize: 14 }}>{nom.message}</div>
              <div style={{ marginLeft: 6, fontSize: 12, color: "#989898", marginTop: 2 }}>
                Submitted: {nom.submitted}. Reviewed: {nom.reviewed}.
              </div>
              {nom.status === "rejected" && (
                <div className="mt-2 p-2" style={{
                  background: "#ffecec", borderRadius: 7, color: "#e13f3f", border: "1px solid #e13f3f"
                }}>
                  Reason: {nom.rejectReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}