import api from "../../config/axios.config";
import { GroupedAvailability, IAvailability, IBooking, ICreateAvailabilityParams } from "../../types/session.type";

export const createAvailability = async (data: ICreateAvailabilityParams) => {
  const response = await api.post(`/session/create-availability`, data);
  return response.data;
};

export const getTrainerAvailabilityByDate = async (
  date: string
): Promise<IAvailability[]> => {
  const response = await api.get(
    `/session/get-availability-by-date?date=${date}`
  );
  return response.data.availabilities;
};

export const getTrainerAvailabilities = async (): Promise<GroupedAvailability> => {
  const response = await api.get(`/session/get-my-availabilities`);
  return response.data.groupedAvailabilities;
};

export const getTrainerBookings = async (): Promise<IBooking[]> => {
  const response = await api.get(`/session/bookings`);
  return response.data.bookings;
};
