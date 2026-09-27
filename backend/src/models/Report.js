import mongoose from "mongoose";
import { getNextPublicId } from "../utils/publicId.js";

const reportSchema = new mongoose.Schema(
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

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: [
        "No DR",
        "Mild",
        "Moderate",
        "Severe",
        "Proliferative",
      ],
      required: true,
    },

    recommendation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.pre("validate", async function assignPublicId() {
  if (!this.isNew || this.publicId) return;

  this.publicId = await getNextPublicId("RC-RPT");
});

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;