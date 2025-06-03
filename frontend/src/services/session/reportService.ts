import api from "../../config/axios.config";

import { SubmitReportData } from "../../types/session.type";

export const submitReport = async (data: SubmitReportData) => {
  const response = await api.post("/reports", data);
  return response.data;
};
