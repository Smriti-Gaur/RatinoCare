import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "../../features/landing/LandingPage";

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
          element={<div>Login</div>}
        />

        <Route
          path="/register"
          element={<div>Register</div>}
        />

        {/* =========================
            Protected Application Routes
        ========================= */}

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
          path="/ai-screening"
          element={<div>AI Screening</div>}
        />

        <Route
          path="/profile"
          element={<div>Profile</div>}
        />

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