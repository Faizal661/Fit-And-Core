import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { ITrainerService } from "../Interface/ITrainerService";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { TrainerApplicationData } from "../../types/trainer.types";
import { HttpResCode } from "../../constants/Response.constants";
import { CustomError } from "../../errors/CustomError";

@injectable()
export default class TrainerService implements ITrainerService {
  private trainerRepository: ITrainerRepository;
  private userRepository: IUserRepository;

  constructor(
    @inject("TrainerRepository")
    trainerRepository: ITrainerRepository,
    @inject("UserRepository")
    userRepository: IUserRepository
  ) {
    this.trainerRepository = trainerRepository;
    this.userRepository = userRepository;
  }

  async applyTrainer(data: TrainerApplicationData): Promise<any> {

    const userId = new Types.ObjectId(data.userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError('User not found',HttpResCode.NOT_FOUND);
    }

    const existingApplication = await this.trainerRepository.findOne({
      userId: user._id
    });

    if (existingApplication) {
      throw new CustomError('You already have a trainer application pending',HttpResCode.CONFLICT);
    }

    const trainerData = {
      userId: user._id as Types.ObjectId,
      username: user.username,
      email: user.email,
      phone: data.phone,
      specialization: data.specialization,
      yearsOfExperience: data.yearsOfExperience,
      about: data.about,
      documentProofs: data.documentProofs,
      certifications: data.certifications,
      achievements: data.achievements,
      isApproved: false
    };

    const result = await this.trainerRepository.create(trainerData);
    return result;
  }

  async approveTrainer(trainerId: string): Promise<any> {
    const trainer = await this.trainerRepository.findById(new Types.ObjectId(trainerId));
    if (!trainer) {
      throw new CustomError('Trainer application not found',HttpResCode.NOT_FOUND);
    }

    trainer.isApproved = true;
    await trainer.save();

    const user = await this.userRepository.findById(trainer.userId);
    if (!user) {
      throw new CustomError('User not found',HttpResCode.NOT_FOUND);
    }

    user.role = 'trainer';
    await user.save();

    return {
      trainer,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  async getTrainerApplications(isApproved?: boolean): Promise<any> {
    const filter = isApproved !== undefined ? { isApproved } : {};
    return this.trainerRepository.find(filter);
  }
}