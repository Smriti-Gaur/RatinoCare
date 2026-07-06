import api from "./axios";

export const getMyAppointments = async (params) => {
  const response = await api.get("/appointments/my-appointments", {
    params,
  });

  return response.data;
};

export const bookAppointment = async (slotId) => {
  const response = await api.post("/appointments/book-slot", {
    slotId,
  });

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.patch(
    `/appointments/${id}/cancel`
  );

  return response.data;
};