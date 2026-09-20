import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  resetRegistrationStatus,
} from "../../store/slices/authSlice";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowLeft,
  BadgeCheck,
  Building2,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient", // default role
    medicalLicenseNumber: "",
    specialization: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successBanner, setSuccessBanner] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(resetRegistrationStatus());

    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [dispatch, isAuthenticated, navigate]);

  // Live Password Strength Criteria Checklist
  const passwordCriteria = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(formData.password) },
    { label: "One lowercase letter (a-z)", met: /[a-z]/.test(formData.password) },
    { label: "One number (0-9)", met: /\d/.test(formData.password) },
    {
      label: "One special character (@$!%*?&)",
      met: /[@$!%*?&]/.test(formData.password),
    },
  ];

  const metCount = passwordCriteria.filter((c) => c.met).length;

  const isPasswordStrong = metCount === 5;

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = "Full Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!isPasswordStrong) {
      errors.password = "Password does not meet all security requirements";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!["patient", "doctor"].includes(formData.role)) {
      errors.role = "Please select a valid role";
    }

    if (formData.role === "doctor") {
      if (!formData.medicalLicenseNumber.trim()) {
        errors.medicalLicenseNumber =
          "Medical License Number is required for Doctor registration";
      }
      if (!formData.specialization.trim()) {
        errors.specialization = "Specialization / Subspecialty is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    if (formErrors.role) {
      setFormErrors((prev) => ({ ...prev, role: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      ...(formData.role === "doctor" && {
        medicalLicenseNumber: formData.medicalLicenseNumber.trim(),
        specialization: formData.specialization.trim(),
      }),
    };

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      const msg =
        formData.role === "doctor"
          ? "Doctor registration submitted! Account is pending administrative verification. Redirecting to login..."
          : "Account created successfully! Redirecting to login...";
      setSuccessBanner(msg);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/30">
            <Stethoscope size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              RatinoCare
            </span>
            <span className="ml-2 hidden text-xs text-slate-400 sm:inline">
              Screening System
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 mx-auto flex max-w-xl flex-col justify-center px-5 pb-16 pt-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
        >
          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Join RatinoCare to access diabetes retinopathy screening and report management
            </p>
          </div>

          {/* Role Selector Tabs (Patient vs Doctor) */}
          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Account Type
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-1.5">
              <button
                type="button"
                onClick={() => handleRoleSelect("patient")}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all sm:text-sm ${
                  formData.role === "patient"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User size={16} /> Patient Account
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("doctor")}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all sm:text-sm ${
                  formData.role === "doctor"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Stethoscope size={16} /> Doctor Account
              </button>
            </div>

            {formData.role === "doctor" && (
              <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-xs text-cyan-200">
                <p className="font-semibold flex items-center gap-1.5 text-cyan-300">
                  <BadgeCheck size={16} /> Doctor Credentials Notice
                </p>
                <p className="mt-1 leading-5 text-cyan-200/90">
                  Doctor registrations require valid medical license details. Your account will be submitted for administrative verification before clinical screening features are enabled.
                </p>
              </div>
            )}
          </div>

          {/* Success Banner */}
          {successBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300"
            >
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
              <p className="text-xs font-semibold sm:text-sm">{successBanner}</p>
            </motion.div>
          )}

          {/* Error Banner */}
          {error && !successBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
            >
              <AlertCircle size={20} className="shrink-0 text-red-400" />
              <p className="text-xs font-semibold sm:text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Full Name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={
                    formData.role === "doctor" ? "Dr. Jane Doe" : "John Doe"
                  }
                  className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    formErrors.name
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1.5 text-xs text-red-400">{formErrors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    formErrors.email
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1.5 text-xs text-red-400">{formErrors.email}</p>
              )}
            </div>

            {/* Doctor Specific Fields (License Number & Specialization) */}
            {formData.role === "doctor" && (
              <>
                <div>
                  <label
                    htmlFor="medicalLicenseNumber"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Medical License Number
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <BadgeCheck size={18} />
                    </div>
                    <input
                      id="medicalLicenseNumber"
                      name="medicalLicenseNumber"
                      type="text"
                      value={formData.medicalLicenseNumber}
                      onChange={handleChange}
                      placeholder="e.g. MCI-98765 / NMC-12345"
                      className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                        formErrors.medicalLicenseNumber
                          ? "border-red-500/60 focus:ring-red-500/30"
                          : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                      }`}
                    />
                  </div>
                  {formErrors.medicalLicenseNumber && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {formErrors.medicalLicenseNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Medical Specialization / Practice Area
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Building2 size={18} />
                    </div>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Retinal Specialist / Ophthalmology"
                      className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                        formErrors.specialization
                          ? "border-red-500/60 focus:ring-red-500/30"
                          : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                      }`}
                    />
                  </div>
                  {formErrors.specialization && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {formErrors.specialization}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    formErrors.password
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1.5 text-xs text-red-400">{formErrors.password}</p>
              )}

              {/* Password Strength Live Checklist */}
              {formData.password && (
                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Password Strength Requirements
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {passwordCriteria.map((criterion) => (
                      <div
                        key={criterion.label}
                        className={`flex items-center gap-1.5 text-[11px] ${
                          criterion.met ? "text-emerald-400" : "text-slate-500"
                        }`}
                      >
                        {criterion.met ? (
                          <Check size={13} className="shrink-0 text-emerald-400" />
                        ) : (
                          <X size={13} className="shrink-0 text-slate-600" />
                        )}
                        <span>{criterion.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Confirm Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    formErrors.confirmPassword
                      ? "border-red-500/60 focus:ring-red-500/30"
                      : "border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Boolean(successBanner)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                <>
                  Register as {formData.role === "doctor" ? "Doctor" : "Patient"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 transition-colors hover:text-blue-300 hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RegisterPage;
