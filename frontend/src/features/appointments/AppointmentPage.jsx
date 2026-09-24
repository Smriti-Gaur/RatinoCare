import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import {
  cancelAppointment,
  fetchMyAppointments,
  updateAppointmentStatus,
} from "./services/appointmentService";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-slate-200 text-slate-700 border border-slate-300",
};

const formatDateTime = (value) => {
  if (!value) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getStatusActions = (status) => {
  if (status === "pending") return ["confirmed", "cancelled"];
  if (status === "confirmed") return ["completed", "cancelled"];
  return [];
};

const AppointmentPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const isDoctor = user?.role === "doctor";

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMyAppointments();
      setAppointments(data.appointments || []);
    } catch (requestError) {
      setAppointments([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.role) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const requestAppointments = async () => {
      try {
        const data = await fetchMyAppointments();
        if (isMounted) {
          setAppointments(data.appointments || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setAppointments([]);
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    requestAppointments();

    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  const handleStatusUpdate = async (appointmentId, nextStatus) => {
    setActionLoadingId(appointmentId);

    try {
      await updateAppointmentStatus(appointmentId, nextStatus);
      await loadAppointments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (appointmentId) => {
    setActionLoadingId(appointmentId);

    try {
      await cancelAppointment(appointmentId);
      await loadAppointments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const summaryText = useMemo(() => {
    if (isDoctor) {
      return "Review patient appointments, confirm screening slots, and keep the care journey moving.";
    }

    return "Track your screening schedule, stay on top of follow-ups, and manage upcoming care steps.";
  }, [isDoctor]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              {isDoctor ? "Clinic workflow" : "Care timeline"}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {isDoctor ? "Review patient appointments" : "Your appointments"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{summaryText}</p>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-900">
            <div className="flex items-center justify-center gap-2 font-bold">
              <AlertCircle size={18} />
              We could not load appointments.
            </div>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={loadAppointments}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <CalendarDays className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 font-bold text-slate-800">
              {isDoctor ? "No patients scheduled yet" : "No appointments scheduled yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {isDoctor
                ? "When a patient books a screening visit, it will appear here."
                : "Explore doctors and reserve your next screening time slot."}
            </p>
            {!isDoctor && (
              <Link
                to="/doctors"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Find a doctor <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {appointments.map((appointment) => {
              const appointmentDate = appointment.appointmentDate || appointment.slotId?.date;
              const formattedDate = formatDateTime(appointmentDate);
              const slot = appointment.slotId || {};
              const personName = isDoctor ? appointment.patientId?.name : appointment.doctorId?.name;
              const personRole = isDoctor ? "Patient" : "Doctor";
              const statusActions = getStatusActions(appointment.status);
              const canCancel = appointment.status !== "completed" && appointment.status !== "cancelled";

              return (
                <article key={appointment._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{personRole}</p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950">{personName || "Details unavailable"}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[appointment.status] || statusStyles.pending}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-slate-400" />
                      {formattedDate}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock3 size={16} className="text-slate-400" />
                      {slot.startTime && slot.endTime
                        ? `${slot.startTime} - ${slot.endTime}`
                        : "Time window not listed"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-slate-400" />
                      {appointment.reason || "Diabetic Retinopathy Screening"}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserRound size={16} className="text-slate-400" />
                      {isDoctor ? `Patient email: ${appointment.patientId?.email || "Unavailable"}` : `Doctor email: ${appointment.doctorId?.email || "Unavailable"}`}
                    </p>
                  </div>

                  {statusActions.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {statusActions.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type="button"
                          disabled={actionLoadingId === appointment._id}
                          onClick={() => handleStatusUpdate(appointment._id, nextStatus)}
                          className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoadingId === appointment._id ? "Updating..." : `Mark ${nextStatus}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {!isDoctor && canCancel && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={actionLoadingId === appointment._id}
                        onClick={() => handleCancel(appointment._id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoadingId === appointment._id ? "Cancelling..." : "Cancel appointment"}
                      </button>
                    </div>
                  )}

                  {isDoctor && appointment.status === "completed" && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={15} />
                      Completed with patient follow-up recorded.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentPage;
