import api from "../../config/axios.config";
import {
  GroupedAvailability,
  IAvailability,
  IBooking,
  ICreateAvailabilityParams,
  ISlot,
  UserBooking,
} from "../../types/session.type";

//  ----- availabilities

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

export const getTrainerAvailabilities =
  async (): Promise<GroupedAvailability> => {
    const response = await api.get(`/session/get-my-availabilities`);
    return response.data.groupedAvailabilities;
  };

export const getTrainerBookings = async (): Promise<any> => {
  const response = await api.get(`/session/bookings`);
  return response.data.upcomingBookings;
};

// ------ slots

export const getTrainerSlotsByDate = async (
  trainerId: string,
  date: string
): Promise<ISlot[]> => {
  const response = await api.get(`/session/get-trainer-slots-by-date`, {
    params: {
      trainerId: trainerId,
      date: date,
    },
  });
  return response.data.slots;
};

export const bookTrainerSlot = async ({ slotId }: { slotId: string }) => {
  const response = await api.post(`/session/book-slot`, { slotId });
  return response.data;
};

export const trainerCancelBooking = async ({
  bookingId,
  reason,
}: {
  bookingId: string;
  reason: string;
}) => {
  const response = await api.put("/session/trainer-cancel-booking", {
    bookingId,
    reason,
  });
  return response.data;
};

// user Side
export const getUserBookings = async (trainerId: string):Promise<UserBooking[]> => {
  const response = await api.get(`/session/user-all-bookings`, {
    params: {
      trainerId: trainerId,
    },
  });
  return response.data.data;
};

export const userCancelBooking = async ({
  bookingId,
  reason,
}: {
  bookingId: string;
  reason: string;
}) => {
  const response = await api.put("/session/user-cancel-booking", {
    bookingId,
    reason,
  });
  return response.data;
};