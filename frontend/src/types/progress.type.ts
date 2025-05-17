export interface Progress {
  _id: string;
  userId:string,
  weight: number;
  height: number;
  bmi: number;
  bmiClass: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface progressResponse{
    progresses:Progress[]
}
