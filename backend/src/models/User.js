import mongoose from "mongoose";
import { getNextPublicId } from "../utils/publicId.js";

const userSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    medicalLicenseNumber: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", async function assignPublicId() {
  if (!this.isNew || this.publicId || this.role === "admin") return;

  this.publicId = await getNextPublicId(this.role === "doctor" ? "RC-DOC" : "RC-PAT");
});

const User = mongoose.model("User", userSchema);

export default User;

