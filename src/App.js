import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import CompanyDashboardPage from "./pages/Dashboard/CompanyDashboardPage/CompanyDashboardPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<CompanyDashboardPage />} />
      </Routes>
    </>
  );
};

export default App;
