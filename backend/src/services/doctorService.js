import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import DoctorLicense from "../models/DoctorLicense.js";
import User from "../models/User.js";

export const getAllDoctorsService = async () => {
  const doctors = await User.find({
    role: "doctor",
    isApproved: true,
  }).select("publicId name email role specialization isApproved approvalStatus");

  if (doctors.length === 0) {
    throw new ApiError(404, "No doctors found");
  }

  return {
    success: true,
    count: doctors.length,
    doctors,
  };
};

const findDoctor = (doctorId) => {
  if (mongoose.Types.ObjectId.isValid(doctorId)) {
    return User.findOne({
      $or: [{ _id: doctorId }, { publicId: doctorId }],
      role: "doctor",
    });
  }

  return User.findOne({
    publicId: doctorId,
    role: "doctor",
  });
};

export const getPendingDoctorsService = async () => {
  const doctors = await User.find({
    role: "doctor",
    $or: [
      { approvalStatus: { $in: ["pending", "rejected"] } },
      { isApproved: false },
    ],
  })
    .select(
      "publicId name email specialization medicalLicenseNumber approvalStatus approvalReason createdAt"
    )
    .sort({ createdAt: 1 });

  return {
    success: true,
    count: doctors.length,
    doctors,
  };
};

const reviewDoctor = async (adminId, doctorId, status, reason = "") => {
  const doctor = await findDoctor(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const license = await DoctorLicense.findOne({
    claimedBy: doctor._id,
  }).select("status specialization licenseNumber");

  if (!license || license.status !== "claimed") {
    throw new ApiError(400, "Doctor does not have a valid claimed license");
  }

  const licenseSpecialization = license.specialization.trim().toLowerCase();
  const doctorSpecialization = doctor.specialization.trim().toLowerCase();

  if (status === "approved" && licenseSpecialization !== doctorSpecialization) {
    throw new ApiError(
      400,
      "Doctor specialization does not match the claimed license"
    );
  }

  doctor.isApproved = status === "approved";
  doctor.approvalStatus = status;
  doctor.approvalReason = reason;
  doctor.reviewedBy = adminId;
  doctor.reviewedAt = new Date();
  await doctor.save();

  return {
    success: true,
    doctor: {
      publicId: doctor.publicId,
      name: doctor.name,
      email: doctor.email,
      approvalStatus: doctor.approvalStatus,
      isApproved: doctor.isApproved,
      approvalReason: doctor.approvalReason,
      reviewedAt: doctor.reviewedAt,
    },
  };
};

export const approveDoctorService = (adminId, doctorId) =>
  reviewDoctor(adminId, doctorId, "approved");

export const rejectDoctorService = (adminId, doctorId, reason) =>
  reviewDoctor(adminId, doctorId, "rejected", reason);
