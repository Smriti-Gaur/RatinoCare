import api from "../../../services/api";

export const fetchDoctors = async () => {
  const response = await api.get("/doctors/");
  return response.data;
};