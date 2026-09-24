import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Mail,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { fetchDoctors } from "./services/doctorService";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

const DoctorCard = ({ doctor }) => (
  <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-shadow hover:shadow-md sm:p-6">
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
        {getInitials(doctor.name)}
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-slate-950">{doctor.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Stethoscope size={15} className="text-blue-600" />
          {doctor.specialization || "Specialization not listed"}
        </p>
      </div>
    </div>

    <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
      <p className="flex items-center gap-2 text-sm text-slate-600">
        <Mail size={16} className="text-slate-400" />
        <span className="truncate">{doctor.email}</span>
      </p>
      <p className={`flex items-center gap-2 text-sm font-semibold ${doctor.isApproved ? "text-emerald-700" : "text-amber-700"}`}>
        <ShieldCheck size={16} />
        {doctor.isApproved ? "Credentials approved" : "Verification pending"}
      </p>
    </div>

    <div className="mt-auto pt-6">
      <Link
        to="/appointments"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        View appointments <ArrowRight size={16} />
      </Link>
    </div>
  </article>
);

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDoctors();
      setDoctors(data.doctors || []);
    } catch (requestError) {
      setDoctors([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const requestDoctors = async () => {
      try {
        const data = await fetchDoctors();

        if (isMounted) {
          setDoctors(data.doctors || []);
        }
      } catch (requestError) {
        if (isMounted) {
          setDoctors([]);
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    requestDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredDoctors = doctors.filter((doctor) =>
    [doctor.name, doctor.specialization, doctor.email]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch)),
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Screening network</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find the right doctor for your screening journey.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Explore the doctors connected to RatinoCare and continue to appointments when you are ready.
            </p>
          </div>
        </section>

        <section aria-labelledby="doctor-directory-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Doctor directory</p>
              <h2 id="doctor-directory-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                {loading ? "Available doctors" : `${filteredDoctors.length} doctor${filteredDoctors.length === 1 ? "" : "s"} found`}
              </h2>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search doctors</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or specialty"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              />
            </label>
          </div>

          {loading && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading doctors">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <AlertCircle className="mx-auto text-red-500" size={28} />
              <p className="mt-3 font-bold text-red-900">We could not load the doctor directory.</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button type="button" onClick={loadDoctors} className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <UserRound className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 font-bold text-slate-800">
                {doctors.length === 0 ? "No doctors are listed yet" : "No doctors match your search"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {doctors.length === 0 ? "The directory will appear here when doctor profiles are available." : "Try a different name or specialization."}
              </p>
            </div>
          )}

          {!loading && !error && filteredDoctors.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id || doctor.email} doctor={doctor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;