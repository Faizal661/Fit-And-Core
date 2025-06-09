interface TraineeDetails {
  _id: string;
  username: string;
  profilePicture: string;
}
interface TrainerDetails {
  _id: string;
  username: string;
  profilePicture: string;
}
interface SlotDetails {
  _id: string;
  startTime: string;
  endTime: string;
}
export interface BookingDetails {
  _id: string;
  status: "confirmed" | "canceled" | "completed";
  createdAt: Date;
  notes?: string;
  slotDetails: SlotDetails;
  trainee: TraineeDetails;
  trainer:TrainerDetails,
  slotStart: Date;
}