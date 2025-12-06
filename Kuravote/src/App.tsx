import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import Nominations from "./pages/Nominations";
import NotFound from "./pages/NotFound";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/officer" element={<OfficerDashboard />} />
      <Route path="/candidate" element={<CandidateDashboard />} />
      <Route path="/voter" element={<VoterDashboard />} />
      <Route path="/nominations" element={<Nominations />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;