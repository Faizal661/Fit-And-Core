import cron from "node-cron";
import { Types } from "mongoose";
import { container } from "tsyringe";
import { NotificationService } from "../services/Implementation/notification.service";
import { ISessionService } from "../services/Interface/ISessionService";
import { ISubscriptionService } from "../services/Interface/ISubscriptionService";

const setupScheduledJobs = () => {
  const notificationService = container.resolve<NotificationService>(
    "NotificationService"
  );
  const subscriptionService = container.resolve<ISubscriptionService>(
    "SubscriptionService"
  );
  const bookingService = container.resolve<ISessionService>("SessionService");

  // --- Job 1:  Subscription Expiry ---
  cron.schedule("0 2 * * *", async () => {
    // "0 2 * * *"
    console.log("Running daily subscription expiry check...");
    try {
      const subscriptions =
        await subscriptionService.getUsersWithExpiringSubscriptions(7);
      for (const subscription of subscriptions) {
        await notificationService.sendNotification({
          userId: subscription.userId,
          type: "subscription_expiry",
          message: `Your subscription will expire on ${new Date(
            subscription.expiryDate!
          ).toLocaleDateString()}. Renew now to continue!`,
          read: false,
          //   link: '/profile/subscription',
          metadata: {
            subscriptionId: subscription._id,
            expiryDate: subscription.expiryDate,
          },
        });
      }
      console.log(
        `Subscription expiry check completed. ${subscriptions.length} notifications sent.`
      );
    } catch (error) {
      console.error("Error during subscription expiry check:", error);
    }
  });

  // --- Job 2:  Upcoming Video Sessions ---
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running upcoming video session check...");
    try {
      const currentMoment = new Date();

      // Here iam using 5.5 hour ahead , Because of iam storing date in the IST format,
      // But when server checking new Date() , It will get 5.5 hour behind time as current Time (UST) ,
      // So the Best Way is to store our Date in UST format in DB,and then Show the date in the IST format in the frontend.
      const fiveAndHalfHoursInMs = 5.5 * 60 * 60 * 1000; // 5.5 hours for IST
      const fivePointFiveHoursAheadTimestamp =
        new Date(currentMoment.getTime() + fiveAndHalfHoursInMs);

      const fifteenMinutesInMs = 15 * 60 * 1000 ;
      const fifteenMinutesLaterTimestamp =
        new Date(fivePointFiveHoursAheadTimestamp.getTime() + fifteenMinutesInMs);

      const upcomingBookings = await bookingService.getUpcomingBookings(
        fivePointFiveHoursAheadTimestamp,
        fifteenMinutesLaterTimestamp
      );

      for (const booking of upcomingBookings) {
        await notificationService.sendNotification({
          userId: new Types.ObjectId(booking.trainee._id),
          userType: "Trainee",
          type: "upcoming_session",
          message: `Get ready! Your video session with ${booking.trainer.username} starts at ${booking.slotDetails.startTime} today.`,
          read: false,
          //   link: `/video-call/${booking._id}`,
          metadata: { bookingId: booking._id, sessionTime: booking.slotStart },
        });

        await notificationService.sendNotification({
          userId: new Types.ObjectId(booking.trainer._id),
          userType: "Trainer",
          type: "upcoming_session",
          message: `Get ready! Your video session with ${booking.trainee.username} starts at ${booking.slotDetails.startTime} today.`,
          read: false,
          // link: `/video-call/${booking._id}`,
          metadata: { bookingId: booking._id, sessionTime: booking.slotStart },
        });
      }
      console.log(
        `Upcoming video session check completed. ${
          upcomingBookings.length * 2
        } notifications sent.`
      );
    } catch (error) {
      console.error("Error during upcoming video session check:", error);
    }
  });
  console.log(`Scheduled Jobs set  ✅`);
};

export default setupScheduledJobs;
