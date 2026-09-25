import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { fetchDoctors } from "./services/doctorService";
import { bookSlotAppointment, fetchAvailableSlots } from "../slots/services/slotService";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

const formatSlotDate = (value) =>
  new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));

const DoctorCard = ({ doctor, selected, onSelect }) => (
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
      <button
        type="button"
        onClick={() => onSelect(doctor)}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
          selected ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        {selected ? "Doctor selected" : "View available slots"} <ArrowRight size={16} />
      </button>
    </div>
  </article>
);

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [slotsError, setSlotsError] = useState(null);

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
        if (isMounted) setDoctors(data.doctors || []);
      } catch (requestError) {
        if (isMounted) {
          setDoctors([]);
          setError(requestError.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    requestDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDoctor?._id) return undefined;

    let isMounted = true;

    const requestSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      setBookingSuccess(null);
      setSelectedSlot(null);

      try {
        const data = await fetchAvailableSlots(selectedDoctor._id);
        if (isMounted) setSlots(data.slots || []);
      } catch (requestError) {
        if (isMounted) {
          setSlots([]);
          setSlotsError(requestError.message);
        }
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    requestSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDoctor]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSlots([]);
    setSelectedSlot(null);
    setSlotsError(null);
    setBookingSuccess(null);
  };

  const handleBookSlot = async (slot) => {
    setBookingSlotId(slot._id);
    setSlotsError(null);
    try {
      const data = await bookSlotAppointment(slot._id);
      setBookingSuccess(data.appointment);
      setSlots((currentSlots) => currentSlots.filter((currentSlot) => currentSlot._id !== slot._id));
    } catch (requestError) {
      setSlotsError(requestError.message);
    } finally {
      setBookingSlotId(null);
    }
  };

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
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Book appointment</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Choose a doctor and reserve your screening slot.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Search by name or specialization, then select an available time that works for you.
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
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or specialty" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </label>
          </div>

          {loading && <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading doctors">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-200" />)}</div>}
          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <AlertCircle className="mx-auto text-red-500" size={28} />
              <p className="mt-3 font-bold text-red-900">We could not load the doctor directory.</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button type="button" onClick={loadDoctors} className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">Try again</button>
            </div>
          )}
          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <UserRound className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 font-bold text-slate-800">{doctors.length === 0 ? "No doctors are listed yet" : "No doctors match your search"}</p>
              <p className="mt-1 text-sm text-slate-500">{doctors.length === 0 ? "The directory will appear here when doctor profiles are available." : "Try a different name or specialization."}</p>
            </div>
          )}
          {!loading && !error && filteredDoctors.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDoctors.map((doctor) => <DoctorCard key={doctor._id || doctor.email} doctor={doctor} selected={selectedDoctor?._id === doctor._id} onSelect={handleSelectDoctor} />)}
            </div>
          )}
        </section>

        {selectedDoctor && (
          <section aria-labelledby="available-slots-heading" className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Step 2 · Choose a time</p>
                <h2 id="available-slots-heading" className="mt-1 text-xl font-bold text-slate-950">Available slots with {selectedDoctor.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedDoctor(null)} className="text-sm font-bold text-slate-500 hover:text-slate-900">Choose another doctor</button>
            </div>
            {slotsError && <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"><p className="font-bold">We could not complete that request.</p><p className="mt-1">{slotsError}</p></div>}
            {bookingSuccess && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={19} /> Appointment booked successfully.</div>
                <p className="mt-2 text-sm">Your appointment with {selectedDoctor.name} is now in My Appointments.</p>
                <Link to="/appointments" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">View My Appointments <ArrowRight size={16} /></Link>
              </div>
            )}
            {slotsLoading ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading available slots">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}</div>
            ) : !bookingSuccess && slots.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><CalendarDays className="mx-auto text-slate-300" size={28} /><p className="mt-3 font-bold text-slate-800">No available slots</p><p className="mt-1 text-sm text-slate-500">Please choose another doctor or check back later.</p></div>
            ) : !bookingSuccess && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <div key={slot._id} className={`rounded-xl border p-4 ${selectedSlot?._id === slot._id ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><CalendarDays size={16} className="text-blue-600" />{formatSlotDate(slot.date)}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Clock3 size={16} className="text-slate-400" />{slot.startTime} - {slot.endTime}</p>
                    <button type="button" disabled={bookingSlotId !== null} onClick={() => setSelectedSlot(slot)} className="mt-4 w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60">
                      {selectedSlot?._id === slot._id ? "Selected slot" : "Select slot"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!bookingSuccess && selectedSlot && (
              <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold text-blue-950">Confirm your appointment</p>
                  <p className="mt-1 text-sm text-blue-800">{formatSlotDate(selectedSlot.date)} · {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                </div>
                <button type="button" disabled={bookingSlotId !== null} onClick={() => handleBookSlot(selectedSlot)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {bookingSlotId ? "Booking..." : "Confirm appointment"}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorsPage;
