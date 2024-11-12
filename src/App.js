// src/App.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavTabs from "./components/NavTabs";
import Overview from "./pages/Overview";
import Modules from "./pages/Modules";
import SkillsList from "./pages/SkillsList";
import DescendantsList from "./pages/DescendantsList";
import Rotations from "./pages/Rotations";
import Settings from "./pages/Settings";
import { LocalizationProvider } from "./components/LocalizationContext";

function App() {
  return (
    <LocalizationProvider>
      <div className="App">
        <NavTabs />
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/skillsList" element={<SkillsList />} />
          <Route path="/descendantsList" element={<DescendantsList />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/rotations" element={<Rotations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </LocalizationProvider>
  );
}

export default App;
