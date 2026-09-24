import api from "../../../services/api";

export const fetchMySlots = async () => {
  const response = await api.get("/slots/my-slots");
  return response.data;
};

export const fetchDoctorSlots = async (doctorId) => {
  const response = await api.get(`/slots/doctor/${doctorId}`);
  return response.data;
};

export const fetchAvailableSlots = async (doctorId) => {
  const response = await api.get(`/slots/available/${doctorId}`);
  return response.data;
};

export const createDoctorSlot = async (slotData) => {
  const response = await api.post("/slots/create", slotData);
  return response.data;
};

export const deleteDoctorSlot = async (slotId) => {
  const response = await api.delete(`/slots/${slotId}`);
  return response.data;
};

export const bookSlotAppointment = async (slotId) => {
  const response = await api.post("/appointments/book-slot", { slotId });
  return response.data;
};
