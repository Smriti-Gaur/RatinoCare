import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  FileText,
  Stethoscope,
  ShieldOff,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createDoctorLicense,
  disableDoctorLicense,
  fetchDoctorLicenses,
} from "../services/doctorLicenseService";

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

const licenseStatusStyles = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  claimed: "border-blue-200 bg-blue-50 text-blue-700",
  disabled: "border-slate-200 bg-slate-100 text-slate-600",
};

const AdminDashboard = ({ dashboard }) => {
  const [licenses, setLicenses] = useState([]);
  const [licenseForm, setLicenseForm] = useState({ licenseNumber: "", specialization: "" });
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [licenseAction, setLicenseAction] = useState(false);
  const [licenseActionId, setLicenseActionId] = useState(null);
  const [licenseError, setLicenseError] = useState(null);
  const [licenseSuccess, setLicenseSuccess] = useState(null);

  const loadLicenses = async () => {
    setLicenseLoading(true);
    setLicenseError(null);

    try {
      const data = await fetchDoctorLicenses();
      setLicenses(data.licenses || []);
    } catch (requestError) {
      setLicenseError(requestError.message);
    } finally {
      setLicenseLoading(false);
    }
  };

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      loadLicenses();
    }, 0);

    return () => window.clearTimeout(requestId);
  }, []);

  const handleLicenseSubmit = async (event) => {
    event.preventDefault();
    setLicenseAction(true);
    setLicenseError(null);
    setLicenseSuccess(null);

    try {
      await createDoctorLicense(licenseForm);
      setLicenseForm({ licenseNumber: "", specialization: "" });
      setLicenseSuccess("Verified doctor license added successfully.");
      await loadLicenses();
    } catch (requestError) {
      setLicenseError(requestError.message);
    } finally {
      setLicenseAction(false);
    }
  };

  const handleDisableLicense = async (licenseId) => {
    setLicenseActionId(licenseId);
    setLicenseError(null);
    setLicenseSuccess(null);

    try {
      await disableDoctorLicense(licenseId);
      setLicenseSuccess("License disabled successfully.");
      await loadLicenses();
    } catch (requestError) {
      setLicenseError(requestError.message);
    } finally {
      setLicenseActionId(null);
    }
  };

  return (
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

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><BadgeCheck size={20} /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Doctor credentials</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Doctor License Verification</h2>
          <p className="mt-1 text-sm text-slate-500">Add licenses verified externally before doctors can register with them.</p>
        </div>
      </div>

      {licenseError && <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-800"><AlertCircle size={17} /> {licenseError}</div>}
      {licenseSuccess && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{licenseSuccess}</div>}

      <form onSubmit={handleLicenseSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Medical license number</span><input required value={licenseForm.licenseNumber} onChange={(event) => setLicenseForm((current) => ({ ...current, licenseNumber: event.target.value }))} placeholder="e.g. MED-12345" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
        <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Specialization / practice area</span><input required value={licenseForm.specialization} onChange={(event) => setLicenseForm((current) => ({ ...current, specialization: event.target.value }))} placeholder="e.g. Ophthalmology" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
        <button type="submit" disabled={licenseAction} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{licenseAction ? "Adding..." : "Add verified license"}</button>
      </form>

      <div className="mt-7 overflow-x-auto rounded-xl border border-slate-200">
        {licenseLoading ? <div className="p-6 text-sm text-slate-500">Loading verified licenses...</div> : licenses.length === 0 ? <div className="p-6 text-sm text-slate-500">No verified licenses have been added yet.</div> : <table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">License</th><th className="px-4 py-3">Specialization</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Claimed doctor</th><th className="px-4 py-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{licenses.map((license) => <tr key={license._id}><td className="px-4 py-3 font-semibold text-slate-900">{license.licenseNumber}</td><td className="px-4 py-3 text-slate-600">{license.specialization}</td><td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${licenseStatusStyles[license.status]}`}>{license.status}</span></td><td className="px-4 py-3 text-slate-600">{license.claimedBy?.name || "Not claimed"}</td><td className="px-4 py-3">{license.status === "available" ? <button type="button" onClick={() => handleDisableLicense(license._id)} disabled={licenseActionId === license._id} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"><ShieldOff size={14} /> {licenseActionId === license._id ? "Disabling..." : "Disable"}</button> : <span className="text-xs text-slate-400">No action</span>}</td></tr>)}</tbody></table>}
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
};

export default AdminDashboard;