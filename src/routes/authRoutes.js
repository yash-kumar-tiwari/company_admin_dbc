import { Route } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ChangePasswordPage from "../pages/Auth/ChangePasswordPage";

export default [
  <Route exact path="/login" component={LoginPage} />,
  <Route exact path="/reset-password" component={ResetPasswordPage} />,
  <Route exact path="/forgot-password" component={ForgotPasswordPage} />,
  <Route exact path="/change-password" component={ChangePasswordPage} />,
];
