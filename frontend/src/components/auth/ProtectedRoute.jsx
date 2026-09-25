import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { fetchUserProfile } from "../../store/slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );

  const storedToken = localStorage.getItem("ratinocare_token");

  useEffect(() => {
    if (storedToken && !user && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, loading, storedToken, user]);

  // If loading user profile on initial app load, show clean loading state
  if (loading && storedToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <Stethoscope size={24} className="animate-pulse text-white" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Verifying Authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated && !storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
