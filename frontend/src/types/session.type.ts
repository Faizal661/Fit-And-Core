export interface ICreateAvailabilityParams {
  _id?: string;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface IAvailability {
  _id?: string;
  trainerId: string;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GroupedAvailability {
  [dateKey: string]: IAvailability[];
}

export interface ISlot {
  _id: string;
  availabilityId: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "canceled";
  bookingId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  trainerId: string;
  userId: string;
  slotId: string;
  status: "confirmed" | "canceled" | "completed";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// userBooking details interface
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
export interface UserBooking {
  _id: string;
  status: "confirmed" | "canceled" | "completed";
  createdAt: Date;
  notes?: string;
  slotDetails: SlotDetails;
  trainee: TraineeDetails;
  trainer:TrainerDetails,
  slotStart: Date;
  // selectedDate: Date;
}

export interface CancelBookingParams {
  bookingId: string;
  reason: string;
}

export interface UpdateBookingData {
  bookingId: string;
  status: string;
  feedback?: string;
}

export interface BookingDetails extends UserBooking {
  trainerVideoUrl?: string;
  traineeVideoUrl?: string;
  trainerVideoUploadedAt?: string;
  traineeVideoUploadedAt?: string;
  updatedAt?: string;
}


export interface BookingsResponse {
  bookings: UserBooking[];
  total: number;
  currentPage: number;
  totalPages: number;
}