import api from "../../../services/api";

export const fetchMyReports = async () => {
  const response = await api.get("/reports/my-reports");
  return response.data;
};

export const fetchReportById = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

export const downloadReportPdf = async (reportId) => {
  const response = await api.get(`/reports/${reportId}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post("/reports/create", reportData);
  return response.data;
};

export const fetchPatientReports = async (patientId) => {
  const response = await api.get(`/reports/patient/${patientId}`);
  return response.data;
};

export const fetchDoctorReports = async (doctorId) => {
  const response = await api.get(`/reports/doctor/${doctorId}`);
  return response.data;
};

export const searchReports = async (search) => {
  const response = await api.get(`/reports/search?search=${encodeURIComponent(search)}`);
  return response.data;
};
