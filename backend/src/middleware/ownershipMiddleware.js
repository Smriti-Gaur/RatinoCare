import Report from "../models/Report.js";

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

export const verifyReportOwnership = async (
  req,
  res,
  next
) => {
  try {

    const report = await Report.findById(
      req.params.id
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Doctor can access only reports they created
    if (
      req.user.role === "doctor" &&
      report.doctorId.toString() === req.user.id
    ) {
      return next();
    }

    // Patient can access only their own reports
    if (
      req.user.role === "patient" &&
      report.patientId.toString() === req.user.id
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};