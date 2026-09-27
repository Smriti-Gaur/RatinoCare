import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import { getNextPublicId } from "./publicId.js";

const backfill = async (Model, prefix, filter = {}) => {
  const records = await Model.find({ publicId: { $exists: false }, ...filter }).select("_id role");

  for (const record of records) {
    const publicId = await getNextPublicId(prefix(record));
    await Model.updateOne({ _id: record._id }, { $set: { publicId } });
  }
};

export const backfillPublicIds = async () => {
  await backfill(User, (user) => (user.role === "doctor" ? "RC-DOC" : "RC-PAT"), {
    role: { $in: ["patient", "doctor"] },
  });
  await backfill(Appointment, () => "RC-APT");
  await backfill(Report, () => "RC-RPT");
};