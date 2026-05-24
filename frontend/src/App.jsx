import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

import UploadCVPage from "./pages/UploadCVPage";
import CVReviewPage from "./pages/CVReviewPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";

import DashboardLayout from "./components/layout/DashboardLayout";

// ─────────────────────────────────────────────
// PRIVATE ROUTE
// ─────────────────────────────────────────────
function PrivateRoute({ children }) {
  const token =
    localStorage.getItem("token");

  return token ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage />
          }
        />

        {/* PRIVATE */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >

          <Route
            path="/home"
            element={<HomePage />}
          />

          <Route
            path="/jobs"
            element={<JobsPage />}
          />

          {/* DETAIL JOB */}
          <Route
            path="/jobs/:id"
            element={
              <JobDetailPage />
            }
          />

          <Route
            path="/analysis"
            element={
              <UploadCVPage />
            }
          />

          <Route
            path="/review"
            element={
              <CVReviewPage />
            }
          />

          <Route
            path="/saved"
            element={<SavedPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}