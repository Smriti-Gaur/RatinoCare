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
            element={<div>Dashboard</div>}
          />

          <Route
            path="/appointments"
            element={<div>Appointments</div>}
          />

          <Route
            path="/doctors"
            element={<div>Doctors</div>}
          />

          <Route
            path="/reports"
            element={<div>Reports</div>}
          />

          <Route
            path="/slots"
            element={<div>Slots</div>}
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