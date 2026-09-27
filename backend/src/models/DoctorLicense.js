import mongoose from "mongoose";

const doctorLicenseSchema = new mongoose.Schema(
  {
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    normalizedLicenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "claimed", "disabled"],
      default: "available",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "doctorLicenses",
  },
);

const DoctorLicense = mongoose.model("DoctorLicense", doctorLicenseSchema);

export default DoctorLicense;
