import axios from "../../config/axios";

export const fetchUserCount = async () => {
  try {
    const response = await axios.get("/admin/user-count");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user count");
  }
};

export const fetchTrainerCount = async () => {
  try {
    const response = await axios.get("/admin/trainer-count");
    console.log('fetchTrainerCount',response)
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trainer count");
  }
};
