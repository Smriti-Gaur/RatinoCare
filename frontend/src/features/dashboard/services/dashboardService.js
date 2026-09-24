import api from "../../../services/api";

export const fetchPatientDashboard = async () => {
  const response = await api.get("/dashboard/patient");
  return response.data;
};

export const fetchDoctorDashboard = async () => {
  const response = await api.get("/dashboard/doctor");
  return response.data;
};

export const fetchAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};