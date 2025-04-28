import api from "../../config/axios.config";

export interface Timeavailablity {
    _id?:string ,
    selectedDate: Date, 
    startTime: string,
    endTime: string,
    slotDuration: number,
  }

export const createAvailability = async (data:Timeavailablity) => {
    const response = await api.post(`/session/create-availability`,data);
    return response.data;
};
