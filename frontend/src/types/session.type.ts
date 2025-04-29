

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

  