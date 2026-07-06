import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";

import { USER_ROLES } from "../config/constants";

const AppRouter = () => {

  return (

    <BrowserRouter>

      <Routes>

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        <Route element={<ProtectedRoute />}>

          <Route
            element={<DashboardLayout />}
          >

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                  ]}
                />
              }
            >

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

            </Route>

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.DOCTOR,
                  ]}
                />
              }
            >

              <Route
                path="/doctor/dashboard"
                element={<DoctorDashboard />}
              />

            </Route>

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.PATIENT,
                  ]}
                />
              }
            >

              <Route
                path="/patient/dashboard"
                element={<PatientDashboard />}
              />

            </Route>

          </Route>

        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

};

export default AppRouter;