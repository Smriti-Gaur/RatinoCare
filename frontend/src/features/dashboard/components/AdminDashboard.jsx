import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  FileText,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

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

const AdminDashboard = ({ dashboard }) => (
  <div className="space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Platform overview</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">RatinoCare is moving with you.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
          Monitor the screening network, appointment flow, reports, and available capacity from one place.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/appointments" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
            Review appointments <ArrowRight size={16} />
          </Link>
          <Link to="/doctors" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15">
            View doctors
          </Link>
        </div>
      </div>
    </section>

    <section aria-labelledby="admin-summary-heading">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Network snapshot</p>
        <h2 id="admin-summary-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">People and activity</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Registered doctors" value={dashboard?.totalDoctors ?? 0} icon={Stethoscope} tone="bg-blue-50 text-blue-600" />
        <SummaryCard label="Registered patients" value={dashboard?.totalPatients ?? 0} icon={Users} tone="bg-cyan-50 text-cyan-600" />
        <SummaryCard label="Total appointments" value={dashboard?.totalAppointments ?? 0} icon={CalendarDays} tone="bg-amber-50 text-amber-600" />
        <SummaryCard label="Screening reports" value={dashboard?.totalReports ?? 0} icon={FileText} tone="bg-emerald-50 text-emerald-600" />
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Appointment flow</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Current statuses</h2>
          </div>
          <Activity className="text-slate-300" size={23} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-700">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-950">{dashboard?.pendingAppointments ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-950">{dashboard?.confirmedAppointments ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">Completed</p>
            <p className="mt-2 text-3xl font-bold text-blue-950">{dashboard?.completedAppointments ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-5">
            <p className="text-sm font-medium text-slate-600">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{dashboard?.cancelledAppointments ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Capacity</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Slot utilization</h2>
          </div>
          <CalendarCheck2 className="text-slate-300" size={23} />
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-4">
            <span className="flex items-center gap-2 text-sm font-bold text-blue-800"><CalendarClock size={17} /> Available slots</span>
            <span className="text-xl font-bold text-blue-950">{dashboard?.availableSlots ?? 0}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700"><CheckCircle2 size={17} /> Booked slots</span>
            <span className="text-xl font-bold text-slate-950">{dashboard?.bookedSlots ?? 0}</span>
          </div>
        </div>
        <Link to="/slots" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
          Open slot management <ArrowRight size={15} />
        </Link>
        <div className="mt-5 border-t border-slate-100 pt-5">
          <Link to="/reports" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700">
            Review reports <FileText size={15} />
          </Link>
        </div>
      </div>
    </section>

    <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-sm text-blue-900 sm:px-6">
      <p>Keep platform activity aligned with safe screening workflows.</p>
      <Link to="/appointments" className="ml-4 inline-flex shrink-0 items-center gap-1 font-bold text-blue-700 hover:text-blue-800">
        View activity <ArrowRight size={15} />
      </Link>
    </div>
  </div>
);

export default AdminDashboard;