import { NextFunction, Request, Response } from "express";

export interface ISessionController {
    createAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTrainerAvailabilityByDate(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUpcomingTrainerAvailabilities(req: Request,res: Response,next: NextFunction): Promise<void> 

    //slots
    getTrainerSlotsByDate( req: Request, res: Response, next: NextFunction): Promise<void>
    bookSlot( req: Request, res: Response, next: NextFunction): Promise<void>
    cancelAvailableSlot( req: Request, res: Response, next: NextFunction): Promise<void>
    
    //boookiing
    getUpcomingTrainerBookings( req: Request, res: Response, next: NextFunction): Promise<void>
    getBookingDetailsById( req: Request, res: Response, next: NextFunction): Promise<void>
    trainerCancelBooking( req: Request, res: Response, next: NextFunction): Promise<void>
    getAllUserBookingsWithTrainer( req: Request, res: Response, next: NextFunction): Promise<void>
    getAllUserBookings( req: Request, res: Response, next: NextFunction): Promise<void>
    userCancelBooking( req: Request, res: Response, next: NextFunction): Promise<void>
    updateBookingStatus( req: Request, res: Response, next: NextFunction): Promise<void>
    // deleteAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    // getTrainerAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
  }