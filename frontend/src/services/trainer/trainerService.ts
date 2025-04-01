import axios from "../../config/axios.config";

export interface ApplicationStatus {
  status: "none" | "pending" | "approved" | "rejected";
  reason?: string;
}

export const checkTrainerApplicationStatus =
  async (): Promise<ApplicationStatus> => {
    const response = await axios.get("/trainer/application/status");
    return response.data;
  };
