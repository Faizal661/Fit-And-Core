export interface Progress {
  _id: string;
  userId:string,
  weight: string;
  height: string;
  bmi: string;
  bmiClass: string;
  createdAt: string;
  createdBy: string;
}

export interface progressResponse{
    progresses:Progress[]
}
