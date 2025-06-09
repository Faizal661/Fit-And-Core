export interface IRecordingService {
  uploadVideo(file: Express.Multer.File): Promise<{
    url: string;
    publicId: string;
    folder: string;
    size: number;
  }>;
}