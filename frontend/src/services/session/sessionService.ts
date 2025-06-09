import api from "../../config/axios.config";
import {
  GroupedAvailability,
  IAvailability,
  ICreateAvailabilityParams,
  ISlot,
} from "../../types/session.type";

//  -----       availabilities

export const createAvailability = async (data: ICreateAvailabilityParams) => {
  const response = await api.post(`/session/availabilities`, data);
  return response.data;
};

export const getTrainerAvailabilities =
  async (): Promise<GroupedAvailability> => {
    const response = await api.get(`/session/availabilities`);
    return response.data.groupedAvailabilities;
  };

export const getTrainerAvailabilityByDate = async (
  date: string
): Promise<IAvailability[]> => {
  const response = await api.get(
    `/session/availabilities/by-date?date=${date}`
  );
  return response.data.availabilities;
};

// ---------------  slots

export const getTrainerSlotsByDate = async (
  trainerId: string,
  date: string
): Promise<ISlot[]> => {
  const response = await api.get(`/session/slots/by-date`, {
    params: {
      trainerId: trainerId,
      date: date,
    },
  });
  return response.data.slots;
};

export const bookTrainerSlot = async ({ slotId }: { slotId: string }) => {
  const response = await api.post(`/session/slots/book`, { slotId });
  return response.data;
};
export const cancelTrainerSlot = async ({ slotId }: { slotId: string }) => {
  const response = await api.patch(`/session/slots/cancel`, { slotId });
  return response.data;
};

