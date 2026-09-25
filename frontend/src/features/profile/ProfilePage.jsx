import { useEffect } from "react";
import { AlertCircle, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { fetchUserProfile } from "../../store/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const displayError = error || (!loading && !user ? "Your profile could not be loaded." : null);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl bg-slate-950 px-6 py-8 text-white sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Account</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Your profile</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Review the account details RatinoCare currently stores for your care workflow.
          </p>
        </section>

        {loading && <div className="h-72 animate-pulse rounded-2xl bg-slate-200" aria-label="Loading profile" />}
        {displayError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-900">
            <div className="flex items-center gap-2 font-bold"><AlertCircle size={18} /> Profile unavailable</div>
            <p className="mt-2 text-sm text-red-700">{displayError}</p>
          </div>
        )}
        {!loading && !displayError && user && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><UserRound size={25} /></div>
              <div><h2 className="text-xl font-bold text-slate-950">{user.name}</h2><p className="mt-1 text-sm capitalize text-slate-500">{user.role} account</p></div>
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Email</dt><dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><Mail size={16} className="text-blue-600" />{user.email}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Role</dt><dd className="mt-2 flex items-center gap-2 text-sm font-semibold capitalize text-slate-800"><ShieldCheck size={16} className="text-emerald-600" />{user.role}</dd></div>
              {user.role === "doctor" && <>
                <div><dt className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Specialization</dt><dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><Stethoscope size={16} className="text-blue-600" />{user.specialization || "Not listed"}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Medical license</dt><dd className="mt-2 text-sm font-semibold text-slate-800">{user.medicalLicenseNumber || "Not listed"}</dd></div>
              </>}
            </dl>
            <p className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">Profile editing is not enabled by the current backend contract, so no unsupported fields are sent.</p>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;