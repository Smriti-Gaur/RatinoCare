import User from "../models/User.js";

const requireApprovedDoctor = async (req, res, next) => {
  if (req.user.role !== "doctor") {
    return next();
  }

  try {
    const doctor = await User.findById(req.user.id).select("role isApproved");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Doctor account is not available",
      });
    }

    if (!doctor.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is awaiting administrative approval",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default requireApprovedDoctor;
