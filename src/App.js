import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavTabs from "./components/NavTabs";
import Build from "./pages/Overview";
import Modules from "./pages/Modules";
import SkillsList from "./pages/SkillsList";
import DescendantsList from "./pages/DescendantsList";

function App() {
  return (
    <div className="App">
      <NavTabs />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Build />} />
        <Route path="/skillsList" element={<SkillsList />} />
        <Route path="/descendantsList" element={<DescendantsList />} />
        <Route path="/modules" element={<Modules />} />
      </Routes>
    </div>
  );
}

export default App;
