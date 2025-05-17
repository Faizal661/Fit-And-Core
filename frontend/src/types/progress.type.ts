export interface Progress {
  _id: string;
  userId:string,
  weight: number;
  height: number;
  bmi: number;
  bmiClass: string;
  createdAt: Date | string;
  updatedAt: Date| string;
}

export interface progressResponse{
    progresses:Progress[]
}
