import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PatientRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user?.role !== "patient") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PatientRoute;