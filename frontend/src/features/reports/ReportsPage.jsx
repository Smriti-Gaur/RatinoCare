import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  FileText,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { fetchMyAppointments } from "../appointments/services/appointmentService";
import {
  createReport,
  fetchMyReports,
  fetchPatientReports,
  fetchDoctorReports,
} from "./services/reportService";

const severityStyles = {
  "No DR": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mild: "bg-blue-50 text-blue-700 border-blue-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Severe: "bg-orange-50 text-orange-700 border-orange-200",
  Proliferative: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
};

const formatAppointmentDate = (appointment) => {
  const date = appointment.appointmentDate || appointment.slotId?.date;
  const time = appointment.slotId?.startTime && appointment.slotId?.endTime
    ? `, ${appointment.slotId.startTime} - ${appointment.slotId.endTime}`
    : "";

  return `${formatDate(date)}${time}`;
};

const reportCardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5";

const ReportCard = ({ report, isDoctor }) => {
  const person = isDoctor ? report.patientId : report.doctorId;

  return (
    <article className={reportCardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            {isDoctor ? "Patient report" : "Screening report"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{person?.name || "Care details unavailable"}</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${severityStyles[report.severity] || "border-slate-200 bg-slate-50 text-slate-700"}`}>
          {report.severity}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <span>Created {formatDate(report.createdAt)}</span>
        </p>
        <p className="flex items-start gap-2">
          <Stethoscope size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <span>{isDoctor ? `Patient email: ${person?.email || "Unavailable"}` : `Doctor: ${person?.name || "Unavailable"}`}</span>
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Diagnosis</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{report.diagnosis}</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Recommendation</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{report.recommendation}</p>
      </div>
    </article>
  );
};

const ReportsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [lookupType, setLookupType] = useState("patient");
  const [lookupId, setLookupId] = useState("");
  const [form, setForm] = useState({
    patientId: "",
    appointmentId: "",
    diagnosis: "",
    severity: "No DR",
    recommendation: "",
  });

  const isDoctor = user?.role === "doctor";
  const isAdmin = user?.role === "admin";
  const completedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "completed"),
    [appointments],
  );

  const loadReports = useCallback(async () => {
    if (!user?.role) return;

    setLoading(true);
    setError(null);

    try {
      let data;

      if (isAdmin) {
        setReports([]);
        return;
      }

      data = await fetchMyReports();
      setReports(data.reports || []);
    } catch (requestError) {
      setReports([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.role]);

  const loadDoctorAppointments = useCallback(async () => {
    try {
      const data = await fetchMyAppointments();
      setAppointments(data.appointments || []);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    if (!user?.role) return undefined;

    const requestId = window.setTimeout(() => {
      loadReports();

      if (isDoctor) {
        loadDoctorAppointments();
      }
    }, 0);

    return () => window.clearTimeout(requestId);
  }, [isDoctor, loadDoctorAppointments, loadReports, user?.role]);

  const handleAppointmentChange = (appointmentId) => {
    const appointment = completedAppointments.find((item) => item._id === appointmentId);
    setForm((current) => ({
      ...current,
      appointmentId,
      patientId: appointment?.patientId?._id || appointment?.patientId || "",
    }));
  };

  const handleCreateReport = async (event) => {
    event.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createReport(form);
      setForm({
        patientId: "",
        appointmentId: "",
        diagnosis: "",
        severity: "No DR",
        recommendation: "",
      });
      setSuccessMessage("The screening report was saved successfully.");
      await loadReports();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminLookup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = lookupType === "patient"
        ? await fetchPatientReports(lookupId.trim())
        : await fetchDoctorReports(lookupId.trim());
      setReports(data.reports || []);
    } catch (requestError) {
      setReports([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              {isDoctor ? "Clinical documentation" : isAdmin ? "System oversight" : "Screening history"}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {isDoctor ? "Create and review reports" : isAdmin ? "Report records" : "Your screening reports"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              {isDoctor
                ? "Record the screening outcome and give each patient a clear next step after a completed appointment."
                : isAdmin
                  ? "Review report records by patient or doctor when administrative access is needed."
                  : "Keep your screening findings and recommendations in one accessible care history."}
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-900">
            <div className="flex items-center justify-center gap-2 font-bold"><AlertCircle size={18} /> We could not complete that report request.</div>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button type="button" onClick={loadReports} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"><RefreshCw size={15} /> Try again</button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 size={18} /> {successMessage}</div>
        )}

        {isDoctor && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ClipboardPlus size={19} /></div>
              <div><h2 className="text-xl font-bold text-slate-950">New screening report</h2><p className="mt-1 text-sm text-slate-500">Reports can be created only for completed appointments.</p></div>
            </div>

            {completedAppointments.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">There are no completed appointments ready for reporting.</div>
            ) : (
              <form onSubmit={handleCreateReport} className="mt-6 grid gap-5 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-700 lg:col-span-2"><span>Completed appointment</span><select required value={form.appointmentId} onChange={(event) => handleAppointmentChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"><option value="">Select an appointment</option>{completedAppointments.map((appointment) => <option key={appointment._id} value={appointment._id}>{appointment.patientId?.name || "Patient"} - {formatAppointmentDate(appointment)}</option>)}</select></label>
                <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Severity</span><select required value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15">{Object.keys(severityStyles).map((severity) => <option key={severity} value={severity}>{severity}</option>)}</select></label>
                <div className="flex items-end rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><ShieldCheck size={17} className="mr-2 shrink-0" /> The report is linked to the selected appointment.</div>
                <label className="space-y-2 text-sm font-semibold text-slate-700 lg:col-span-2"><span>Diagnosis</span><textarea required rows="3" value={form.diagnosis} onChange={(event) => setForm((current) => ({ ...current, diagnosis: event.target.value }))} placeholder="Record the screening finding" className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                <label className="space-y-2 text-sm font-semibold text-slate-700 lg:col-span-2"><span>Recommendation</span><textarea required rows="3" value={form.recommendation} onChange={(event) => setForm((current) => ({ ...current, recommendation: event.target.value }))} placeholder="Add the patient's next recommended step" className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                <div className="lg:col-span-2"><button type="submit" disabled={actionLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><FileText size={16} />{actionLoading ? "Saving report..." : "Save report"}</button></div>
              </form>
            )}
          </section>
        )}

        {!isAdmin && (loading ? <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-200" />)}</div> : reports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center"><FileText className="mx-auto text-slate-300" size={34} /><p className="mt-3 font-bold text-slate-800">No reports available yet</p><p className="mt-1 text-sm text-slate-500">Completed screening reports will appear here once they are recorded.</p></div> : <div className="grid gap-5 lg:grid-cols-2">{reports.map((report) => <ReportCard key={report._id} report={report} isDoctor={isDoctor} />)}</div>)}

        {isAdmin && (
          <>
            <form onSubmit={handleAdminLookup} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ShieldCheck size={19} /></div>
                <div><h2 className="text-xl font-bold text-slate-950">Find report records</h2><p className="mt-1 text-sm text-slate-500">Use a patient or doctor ID to review linked screening reports.</p></div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-end">
                <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Search by</span><select value={lookupType} onChange={(event) => setLookupType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"><option value="patient">Patient ID</option><option value="doctor">Doctor ID</option></select></label>
                <label className="space-y-2 text-sm font-semibold text-slate-700"><span>{lookupType === "patient" ? "Patient" : "Doctor"} ID</span><input required value={lookupId} onChange={(event) => setLookupId(event.target.value)} placeholder="Enter MongoDB ID" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"><FileText size={16} /> Load reports</button>
              </div>
            </form>

            {!loading && reports.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center"><UserRound className="mx-auto text-slate-300" size={34} /><p className="mt-3 font-bold text-slate-800">No reports found for this record</p><p className="mt-1 text-sm text-slate-500">Submit another patient or doctor ID to search again.</p></div>}
            {!loading && reports.length > 0 && <div className="grid gap-5 lg:grid-cols-2">{reports.map((report) => <ReportCard key={report._id} report={report} isDoctor={false} />)}</div>}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
