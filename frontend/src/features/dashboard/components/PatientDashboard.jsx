import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  FileText,
  RefreshCw,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";

const appointmentStatusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
};

const formatDate = (value) => {
  if (!value) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const SummaryCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const PatientDashboard = ({ dashboard }) => {
  const nextAppointment = dashboard?.nextAppointment;
  const latestReport = dashboard?.latestReport;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Patient overview</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Stay ahead of your screening care.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Keep your appointments, screening reports, and next steps organized in one calm space.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/doctors" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
              Find a doctor <ArrowRight size={16} />
            </Link>
            <Link to="/appointments" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15">
              View appointments
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="appointment-summary-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Your activity</p>
            <h2 id="appointment-summary-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">Appointment summary</h2>
          </div>
          <Link to="/appointments" className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 sm:flex">
            See all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total appointments" value={dashboard?.totalAppointments ?? 0} icon={CalendarDays} tone="bg-blue-50 text-blue-600" />
          <SummaryCard label="Pending" value={dashboard?.pendingAppointments ?? 0} icon={CalendarClock} tone="bg-amber-50 text-amber-600" />
          <SummaryCard label="Confirmed" value={dashboard?.confirmedAppointments ?? 0} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" />
          <SummaryCard label="Completed" value={dashboard?.completedAppointments ?? 0} icon={FileText} tone="bg-cyan-50 text-cyan-600" />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Coming up</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Next appointment</h2>
            </div>
            <CalendarDays className="text-slate-300" size={23} />
          </div>

          {nextAppointment ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-lg font-bold text-slate-950">Diabetes retinopathy screening</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Stethoscope size={16} className="text-blue-600" />
                    {nextAppointment.doctorId?.name || "Doctor details unavailable"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formatDate(nextAppointment.appointmentDate)}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ${appointmentStatusStyles[nextAppointment.status] || "bg-slate-200 text-slate-700"}`}>
                  {nextAppointment.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <CalendarDays className="mx-auto text-slate-300" size={28} />
              <p className="mt-3 font-bold text-slate-800">No upcoming appointment</p>
              <p className="mt-1 text-sm text-slate-500">Find a doctor when you are ready to schedule your screening.</p>
              <Link to="/doctors" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                Explore doctors <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Screening records</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Latest report</h2>
            </div>
            <FileText className="text-slate-300" size={23} />
          </div>

          {latestReport ? (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Screening result</p>
                <p className="mt-1 text-lg font-bold text-slate-950">{latestReport.diagnosis || "Result recorded"}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500">Severity</span>
                <span className="font-bold text-slate-800">{latestReport.severity || "Not specified"}</span>
              </div>
              <Link to="/reports" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                View report history <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <FileText className="mx-auto text-slate-300" size={28} />
              <p className="mt-3 font-bold text-slate-800">No reports yet</p>
              <p className="mt-1 text-sm text-slate-500">Your screening reports will appear here after a consultation.</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-sm text-blue-900 sm:px-6">
        <p>Need help planning your next screening appointment?</p>
        <Link to="/doctors" className="ml-4 inline-flex shrink-0 items-center gap-1 font-bold text-blue-700 hover:text-blue-800">
          Get started <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export const PatientDashboardError = ({ onRetry }) => (
  <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
    <p className="font-bold text-red-900">We could not load your dashboard.</p>
    <p className="mt-2 text-sm text-red-700">Please check your connection and try again.</p>
    <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">
      <RefreshCw size={16} /> Try again
    </button>
  </div>
);

export default PatientDashboard;