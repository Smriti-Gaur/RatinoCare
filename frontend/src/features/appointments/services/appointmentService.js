import api from "../../../services/api";

export const fetchMyAppointments = async () => {
  const response = await api.get("/appointments/my-appointments");
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await api.patch(`/appointments/${appointmentId}/cancel`);
  return response.data;
};
