import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "./components/DashboardLayout";
import PatientDashboard, { PatientDashboardError } from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { fetchAdminDashboard, fetchDoctorDashboard, fetchPatientDashboard } from "./services/dashboardService";
import { fetchUserProfile } from "../../store/slices/authSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = user?.role === "admin"
        ? await fetchAdminDashboard()
        : user?.role === "doctor"
          ? await fetchDoctorDashboard()
          : await fetchPatientDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return undefined;

    let isMounted = true;

    const requestDashboard = async () => {
      try {
        const data = user.role === "admin"
          ? await fetchAdminDashboard()
          : user.role === "doctor"
            ? await fetchDoctorDashboard()
            : await fetchPatientDashboard();

        if (isMounted) {
          setDashboard(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    requestDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <DashboardLayout>
      {loading && (
        <div className="space-y-6" aria-label="Loading dashboard">
          <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
      )}
      {!loading && error && <PatientDashboardError onRetry={loadDashboard} />}
      {!loading && !error && user?.role === "doctor" && (
        <DoctorDashboard dashboard={dashboard} doctor={user} />
      )}
      {!loading && !error && user?.role === "admin" && (
        <AdminDashboard dashboard={dashboard} />
      )}
      {!loading && !error && user?.role === "patient" && (
        <PatientDashboard dashboard={dashboard} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;