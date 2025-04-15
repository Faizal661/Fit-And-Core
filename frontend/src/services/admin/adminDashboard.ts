import axios from "../../config/axios.config";

export const fetchUserCount = async () => {
    const response = await axios.get("/admin/user-count");
    return response.data;
};

export const fetchTrainerCount = async () => {
    const response = await axios.get("/admin/trainer-count");
    return response.data;
};

export const fetchMonthlyRegistrationData = async () => {
    const response = await axios.get("/admin/monthly-registrations-data");
    return response.data;
};
