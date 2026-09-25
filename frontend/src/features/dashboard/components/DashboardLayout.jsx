import {
  CalendarDays,
  ClipboardPlus,
  FileText,
  MessageCircleQuestion,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/authSlice";

const navigationItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Book Appointment", to: "/doctors", icon: Stethoscope },
  { label: "Appointments", to: "/appointments", icon: CalendarDays },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "AI Report Assistant", to: "/report-analysis", icon: MessageCircleQuestion },
];

const doctorNavigationItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", to: "/appointments", icon: CalendarDays },
  { label: "Manage slots", to: "/slots", icon: ClipboardPlus },
  { label: "Reports", to: "/reports", icon: FileText },
];

const adminNavigationItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", to: "/appointments", icon: CalendarDays },
  { label: "Doctors", to: "/doctors", icon: Stethoscope },
  { label: "Slots", to: "/slots", icon: ClipboardPlus },
  { label: "Reports", to: "/reports", icon: FileText },
];

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isDoctor = user?.role === "doctor";
  const visibleNavigationItems = user?.role === "admin"
    ? adminNavigationItems
    : isDoctor
      ? doctorNavigationItems
      : navigationItems;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-xl shadow-slate-900/5 transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <NavLink to="/dashboard" onClick={closeSidebar} className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-600/20">
              R
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Ratino<span className="text-blue-600">Care</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-10">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Your care space
          </p>
          <nav className="mt-3 space-y-1" aria-label="Dashboard navigation">
            {visibleNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <UserRound size={18} />
            Profile
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <ClipboardPlus size={19} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Screening care, kept simple</p>
                <p className="text-xs text-slate-500">Manage your next step from one place</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || "RatinoCare member"}</p>
                <p className="text-xs capitalize text-slate-500">{user?.role || "Patient"}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {(user?.name || "R").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;