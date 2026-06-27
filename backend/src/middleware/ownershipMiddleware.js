export const verifyPatientOwnership = (
  req,
  res,
  next
) => {

  // Admin can access everything
  if (req.user.role === "admin") {
    return next();
  }

  // Patient can access only own data
  if (
    req.user.role === "patient" &&
    req.user.id === req.params.patientId
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied",
  });

};

export const verifyDoctorOwnership = (
  req,
  res,
  next
) => {

  // Admin
  if (req.user.role === "admin") {
    return next();
  }

  if (
    req.user.role === "doctor" &&
    req.user.id === req.params.doctorId
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only access your own data",
  });

};