import api from "../../../services/api";

export const fetchDoctorLicenses = async () => {
  const response = await api.get("/doctor-licenses");
  return response.data;
};

export const createDoctorLicense = async (licenseData) => {
  const response = await api.post("/doctor-licenses", licenseData);
  return response.data;
};

export const disableDoctorLicense = async (licenseId) => {
  const response = await api.patch(`/doctor-licenses/${licenseId}/disable`);
  return response.data;
};

export const fetchPendingDoctors = async () => {
  const response = await api.get("/doctors/pending");
  return response.data;
};

export const approveDoctor = async (doctorId) => {
  const response = await api.patch(`/doctors/${doctorId}/approve`);
  return response.data;
};

export const rejectDoctor = async (doctorId, reason) => {
  const response = await api.patch(`/doctors/${doctorId}/reject`, { reason });
  return response.data;
};
