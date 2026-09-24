import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  FileText,
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

const DoctorDashboard = ({ dashboard, doctor }) => (
  <div className="space-y-8">
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Doctor workspace</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Good day{doctor?.name ? `, ${doctor.name}` : ""}.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
          Keep today&apos;s screening appointments, available slots, and patient reports within reach.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/appointments" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
            Review appointments <ArrowRight size={16} />
          </Link>
          <Link to="/slots" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15">
            Manage slots
          </Link>
        </div>
      </div>
    </section>

    <section aria-labelledby="doctor-summary-heading">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Practice overview</p>
        <h2 id="doctor-summary-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">Today and across your workflow</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Today&apos;s appointments" value={dashboard?.todayAppointments ?? 0} icon={CalendarDays} tone="bg-blue-50 text-blue-600" />
        <SummaryCard label="Pending requests" value={dashboard?.pendingAppointments ?? 0} icon={CalendarClock} tone="bg-amber-50 text-amber-600" />
        <SummaryCard label="Confirmed appointments" value={dashboard?.confirmedAppointments ?? 0} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" />
        <SummaryCard label="Reports created" value={dashboard?.reportsCreated ?? 0} icon={FileText} tone="bg-cyan-50 text-cyan-600" />
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Schedule readiness</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Slot availability</h2>
          </div>
          <CalendarCheck2 className="text-slate-300" size={23} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">Available slots</p>
            <p className="mt-2 text-3xl font-bold text-blue-950">{dashboard?.availableSlots ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">Booked slots</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{dashboard?.bookedSlots ?? 0}</p>
          </div>
        </div>
        <Link to="/slots" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
          Open slot management <ArrowRight size={15} />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Patient care</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Worklist shortcuts</h2>
          </div>
          <Users className="text-slate-300" size={23} />
        </div>
        <div className="mt-6 space-y-3">
          <Link to="/appointments" className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700">
            Review appointment requests <ArrowRight size={16} />
          </Link>
          <Link to="/reports" className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700">
            Open screening reports <ArrowRight size={16} />
          </Link>
          <Link to="/slots" className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700">
            Add an available slot <ClipboardPlus size={16} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default DoctorDashboard;