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
