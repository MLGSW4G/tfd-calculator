import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavTabs from "./components/NavTabs";
import Build from "./pages/Build";
import Modules from "./pages/Modules";
import SkillsList from "./pages/SkillsList";

function App() {
  return (
    <div className="App">
      <NavTabs />
      <Routes>
        <Route path="/" element={<Navigate to="/build" replace />} />
        <Route path="/build" element={<Build />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/skillsList" element={<SkillsList />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
