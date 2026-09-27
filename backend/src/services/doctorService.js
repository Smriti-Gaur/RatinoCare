import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const getAllDoctorsService = async () => {

  const doctors = await User.find({
    role: "doctor",
  }).select("publicId name email role medicalLicenseNumber specialization isApproved");

  if (doctors.length === 0) {
    throw new ApiError(
      404,
      "No doctors found"
    );
  }

  return {
    success: true,
    count: doctors.length,
    doctors,
  };

};