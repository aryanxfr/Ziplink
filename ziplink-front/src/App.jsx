import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerificationSuccess from "./pages/auth/VerificationSuccess";
import VerificationFailed from "./pages/auth/VerificationFailed";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";
import EmailSent from "./pages/auth/EmailSent";

import Overview from "./pages/dashboard/Overview";
import UrlManagement from "./pages/dashboard/UrlManagement";
import UrlDetail from "./pages/dashboard/UrlDetail";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import AdminMessages from "./pages/dashboard/AdminMessages";

import NotFound from "./pages/status/NotFound";
import ServerError from "./pages/status/ServerError";
import Unauthorized from "./pages/status/Unauthorized";
import Forbidden from "./pages/status/Forbidden";
import Maintenance from "./pages/status/Maintenance";
import Offline from "./pages/status/Offline";
import SessionExpired from "./pages/status/SessionExpired";
import VerifyEmailChange from "./pages/VerifyEmailChange";

import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorks />} />
      </Route>

      {/* Auth pages — redirect to dashboard if already logged in */}
      <Route element={<PublicLayout/>}>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
            <Route path={ROUTES.VERIFICATION_SUCCESS} element={<VerificationSuccess />} />
            <Route path={ROUTES.VERIFICATION_FAILED} element={<VerificationFailed />} />
            <Route path={ROUTES.PASSWORD_RESET_SUCCESS} element={<PasswordResetSuccess />} />
            <Route path={ROUTES.EMAIL_SENT} element={<EmailSent />} />
          </Route>
        </Route>
      </Route>

      {/* Dashboard (protected in real app once backend auth is wired up) */}
      <Route element={<ProtectedRoute/>}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Overview />} />
          <Route path={ROUTES.URLS} element={<UrlManagement />} />
          <Route path={ROUTES.URL_DETAIL} element={<UrlDetail />} />
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.MESSAGES} element={<AdminMessages />} />
        </Route>
      </Route>

      {/* Standalone verification page — no layout needed */}
      <Route path={ROUTES.VERIFY_EMAIL_CHANGE} element={<VerifyEmailChange />} />

      {/* Status pages */}
      <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />
      <Route path={ROUTES.MAINTENANCE} element={<Maintenance />} />
      <Route path={ROUTES.OFFLINE} element={<Offline />} />
      <Route path={ROUTES.SESSION_EXPIRED} element={<SessionExpired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
