import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { fetchDoctors } from "../doctors/services/doctorService";
import {
  bookSlotAppointment,
  createDoctorSlot,
  deleteDoctorSlot,
  fetchAvailableSlots,
  fetchDoctorSlots,
  fetchMySlots,
} from "./services/slotService";

const slotDateFormatter = (value) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));

const cardBaseClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5";

const emptyDoctorState =
  "No doctors are currently offering screening slots. Please check back later.";

const SlotsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorSlotsMap, setDoctorSlotsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [doctorIdInput, setDoctorIdInput] = useState("");
  const [slotForm, setSlotForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "10:00",
  });

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";
  const isAdmin = user?.role === "admin";

  const loadDoctorSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMySlots();
      setSlots(data.slots || []);
    } catch (requestError) {
      setError(requestError.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminDoctorSlots = async (doctorId) => {
    if (!doctorId) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDoctorSlots(doctorId);
      setSlots(data.slots || []);
    } catch (requestError) {
      setError(requestError.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorData = await fetchDoctors();
      const availableDoctors = doctorData.doctors || [];
      setDoctors(availableDoctors);

      const slotMap = {};
      const responses = await Promise.all(
        availableDoctors.map(async (doctor) => {
          const response = await fetchAvailableSlots(doctor._id);
          return { doctorId: doctor._id, slots: response.slots || [] };
        })
      );

      responses.forEach(({ doctorId, slots }) => {
        slotMap[doctorId] = slots;
      });

      setDoctorSlotsMap(slotMap);
    } catch (requestError) {
      setDoctors([]);
      setDoctorSlotsMap({});
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

    if (isDoctor) {
      loadDoctorSlots();
      return undefined;
    }

    if (isPatient) {
      loadPatientSlots();
      return undefined;
    }

    if (isAdmin) {
      setLoading(false);
      return undefined;
    }

    setLoading(false);
    return undefined;
  }, [user?.role]);

  const handleCreateSlot = async (event) => {
    event.preventDefault();
    setActionLoadingId("create");
    setError(null);

    try {
      await createDoctorSlot({
        date: slotForm.date,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
      });
      setSlotForm({ date: "", startTime: "09:00", endTime: "10:00" });
      await loadDoctorSlots();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    setActionLoadingId(slotId);
    setError(null);

    try {
      await deleteDoctorSlot(slotId);
      await loadDoctorSlots();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBookSlot = async (slotId) => {
    setBookingLoadingId(slotId);
    setError(null);

    try {
      await bookSlotAppointment(slotId);
      await loadPatientSlots();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBookingLoadingId(null);
    }
  };

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return doctors;
    }

    return doctors.filter((doctor) =>
      [doctor.name, doctor.specialization, doctor.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [doctors, search]);

  const renderPatientView = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Available appointments</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Book your next screening slot</h2>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search doctors</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctors"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </label>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <UserRound className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 font-bold text-slate-800">No doctors match your search</p>
          <p className="mt-1 text-sm text-slate-500">Try a different name or specialty to find available screening time.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredDoctors.map((doctor) => {
            const available = doctorSlotsMap[doctor._id] || [];

            return (
              <div key={doctor._id} className={cardBaseClass}>
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
                      {doctor.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "DR"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{doctor.name}</h3>
                      <p className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Stethoscope size={15} className="text-blue-600" />
                        {doctor.specialization || "Specialization not listed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                    <ShieldCheck size={15} />
                    {doctor.isApproved ? "Verified" : "Pending verification"}
                  </div>
                </div>

                <div className="mt-5">
                  {available.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      {emptyDoctorState}
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {available.map((slot) => (
                        <div key={slot._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <CalendarDays size={16} className="text-blue-600" />
                            {slotDateFormatter(slot.date)}
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <Clock3 size={16} className="text-slate-400" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <button
                            type="button"
                            disabled={bookingLoadingId === slot._id}
                            onClick={() => handleBookSlot(slot._id)}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {bookingLoadingId === slot._id ? "Booking..." : "Book this slot"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderDoctorView = () => (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Clinic schedule</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Manage your screening availability</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
            Add new time windows, review current availability, and remove outdated slots before patients book them.
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleCreateSlot} className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-1">
            <span>Date</span>
            <input
              type="date"
              required
              value={slotForm.date}
              onChange={(event) => setSlotForm((current) => ({ ...current, date: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>Start time</span>
            <input
              type="time"
              required
              value={slotForm.startTime}
              onChange={(event) => setSlotForm((current) => ({ ...current, startTime: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>End time</span>
            <input
              type="time"
              required
              value={slotForm.endTime}
              onChange={(event) => setSlotForm((current) => ({ ...current, endTime: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={actionLoadingId === "create"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {actionLoadingId === "create" ? "Saving..." : "Add slot"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <CalendarDays className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 font-bold text-slate-800">No availability has been added yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first screening session to start receiving bookings.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {slots.map((slot) => (
              <article key={slot._id} className={cardBaseClass}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Available slot</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-950">{slotDateFormatter(slot.date)}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${slot.isBooked ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {slot.isBooked ? "Booked" : "Open"}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Clock3 size={16} className="text-slate-400" />
                    {slot.startTime} - {slot.endTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-400" />
                    {slot.isBooked ? "A patient has reserved this slot." : "Ready for booking by patients."}
                  </p>
                </div>

                {!slot.isBooked && (
                  <button
                    type="button"
                    disabled={actionLoadingId === slot._id}
                    onClick={() => handleDeleteSlot(slot._id)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {actionLoadingId === slot._id ? "Removing..." : "Remove slot"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="w-full space-y-2 text-sm font-semibold text-slate-700 md:max-w-md">
            <span>Doctor ID</span>
            <input
              type="text"
              value={doctorIdInput}
              onChange={(event) => setDoctorIdInput(event.target.value)}
              placeholder="Enter doctor ID"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
          </label>

          <button
            type="button"
            onClick={() => loadAdminDoctorSlots(doctorIdInput.trim())}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            View doctor slots
          </button>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <CalendarDays className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 font-bold text-slate-800">No slots to display</p>
          <p className="mt-1 text-sm text-slate-500">Use a valid doctor ID to see their availability and bookings.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => (
            <article key={slot._id} className={cardBaseClass}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Doctor slot</p>
              <h3 className="mt-2 text-lg font-bold text-slate-950">{slotDateFormatter(slot.date)}</h3>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Clock3 size={16} className="text-slate-400" />
                  {slot.startTime} - {slot.endTime}
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-slate-400" />
                  {slot.isBooked ? "Booked" : "Open for booking"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              {isDoctor ? "Clinic operations" : isPatient ? "Care planning" : "Scheduling oversight"}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {isDoctor ? "Screening slots" : isPatient ? "Book an appointment" : "Slots management"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              {isDoctor
                ? "Keep your clinic schedule current and make screening capacity visible to patients."
                : isPatient
                  ? "Choose a doctor and reserve a screening window that matches your needs."
                  : "Review doctor availability across the network and monitor open care windows."}
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-red-900">
            <div className="flex items-center justify-center gap-2 font-bold">
              <AlertCircle size={18} />
              We could not load the slots list.
            </div>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => {
                if (isDoctor) loadDoctorSlots();
                if (isPatient) loadPatientSlots();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-52 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <>
            {isDoctor && renderDoctorView()}
            {isPatient && renderPatientView()}
            {isAdmin && renderAdminView()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SlotsPage;
