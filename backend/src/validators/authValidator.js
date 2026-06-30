import ApiError from "../utils/ApiError.js";

export const validateRegister = (
  req,
  res,
  next
) => {

  const {
    name,
    email,
    password,
    role,
  } = req.body;

  // Required Fields
  if (
    !name ||
    !email ||
    !password ||
    !role
  ) {
    return next(
      new ApiError(
        400,
        "All fields are required"
      )
    );
  }

  // Email Format
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return next(
      new ApiError(
        400,
        "Invalid email format"
      )
    );
  }

  // Password Validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return next(
      new ApiError(
        400,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      )
    );
  }

  // Allowed Roles
  const allowedRoles = [
    "patient",
    "doctor",
    "admin",
  ];

  if (!allowedRoles.includes(role)) {
    return next(
      new ApiError(
        400,
        "Invalid role"
      )
    );
  }

  next();

};

export const validateLogin = (
  req,
  res,
  next
) => {

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return next(
      new ApiError(
        400,
        "Email and Password are required"
      )
    );
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return next(
      new ApiError(
        400,
        "Invalid email format"
      )
    );
  }

  next();

};