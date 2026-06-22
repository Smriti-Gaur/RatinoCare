import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    diagnosis: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: [
        "normal",
        "mild",
        "moderate",
        "severe",
      ],
    },

    prescription: {
      type: String,
    },

    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;