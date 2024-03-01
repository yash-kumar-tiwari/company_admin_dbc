import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import CompanyDashboardPage from "./pages/Dashboard/CompanyDashboardPage/CompanyDashboardPage";
import ViewDigitalCard from "./pages/ViewDigitalCard/ViewDigitalCard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<CompanyDashboardPage />} />
        <Route
          path="/view-digital-card/:companyName/:cardReference"
          element={<ViewDigitalCard />}
        />
      </Routes>
    </>
  );
};

export default App;
