import Counter from "../models/Counter.js";

export const getNextPublicId = async (prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: prefix },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return `${prefix}-${String(counter.sequence).padStart(6, "0")}`;
};