import api from "../../config/axios.config";
import {
  CancelBookingParams,
  UserBooking,
  UpdateBookingData,
} from "../../types/session.type";



export const getTrainerBookings = async (): Promise<UserBooking[]>  => {
  const response = await api.get(`/session/bookings`);
  return response.data.upcomingBookings;
};

export const getUserBookings = async (
  trainerId: string
): Promise<UserBooking[]> => {
  const response = await api.get(`/session/bookings/user`, {
    params: {
      trainerId: trainerId,
    },
  });
  return response.data.data;
};

export const userCancelBooking = async (params: CancelBookingParams) => {
  const { bookingId, reason } = params;
  const response = await api.patch("/session/bookings/user/cancel", {
    bookingId,
    reason,
  });
  return response.data;
};

export const trainerCancelBooking = async (params: CancelBookingParams) => {
  const { bookingId, reason } = params;
  const response = await api.patch("/session/bookings/trainer/cancel", {
    bookingId,
    reason,
  });
  return response.data;
};

export const updateBookingStatus = async (data: UpdateBookingData) => {
  const response = await api.patch(`/session/bookings/${data.bookingId}/status`, {
    status: data.status,
    notes: data.feedback
  });
  return response.data;
};


