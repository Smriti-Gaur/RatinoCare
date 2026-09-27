import mongoose from "mongoose";
import { getNextPublicId } from "../utils/publicId.js";

const appointmentSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
      default: "Diabetic Retinopathy Screening",
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.pre("validate", async function assignPublicId() {
  if (!this.isNew || this.publicId) return;

  this.publicId = await getNextPublicId("RC-APT");
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
