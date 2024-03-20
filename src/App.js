import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import CompanyDashboardPage from "./pages/Dashboard/CompanyDashboardPage/CompanyDashboardPage";
import ViewDigitalCard from "./pages/ViewDigitalCard/ViewDigitalCard";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage/ForgetPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage/ResetPasswordPage";
import EditCardPage from "./pages/Dashboard/EditCardPage/EditCardPage";
import Page404 from "./pages/Error/404Page/Page404";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route
          path="/reset-password/:resetToken"
          element={<ResetPasswordPage />}
        />
        <Route path="/dashboard/*" element={<CompanyDashboardPage />} />
        <Route path="/dashboard/edit-card/:cardID" element={<EditCardPage />} />
        <Route
          path="/v/:companyName/:cardReference"
          element={<ViewDigitalCard />}
        />
        <Route
          path="/view-digital-card/:companyName/:cardReference"
          element={<ViewDigitalCard />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
