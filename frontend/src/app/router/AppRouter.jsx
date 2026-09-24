import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "../../features/landing/LandingPage";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import DashboardPage from "../../features/dashboard/DashboardPage";
import DoctorsPage from "../../features/doctors/DoctorsPage";
import AppointmentPage from "../../features/appointments/AppointmentPage";
import SlotsPage from "../../features/slots/SlotsPage";
import ReportsPage from "../../features/reports/ReportsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Public Routes
        ========================= */}

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

        {/* =========================
            Protected Application Routes
        ========================= */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/appointments"
            element={<AppointmentPage />}
          />

          <Route
            path="/doctors"
            element={<DoctorsPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          <Route
            path="/slots"
              element={<SlotsPage />}
          />

          <Route
            path="/report-analysis"
            element={<div>Report Analysis</div>}
          />

          <Route
            path="/profile"
            element={<div>Profile</div>}
          />
        </Route>

        {/* =========================
            Fallback
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;