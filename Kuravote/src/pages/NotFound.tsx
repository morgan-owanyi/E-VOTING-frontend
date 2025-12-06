import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f6f8fa"}}>
      <h1 style={{fontSize:72,fontWeight:700,color:"#243b5c",marginBottom:8}}>404</h1>
      <h3 style={{marginBottom:16}}>Page Not Found</h3>
      <p style={{color:"#666",marginBottom:32}}>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary" style={{background:"#243b5c",padding:"12px 32px",borderRadius:8}}>Go Home</Link>
    </div>
  );
}