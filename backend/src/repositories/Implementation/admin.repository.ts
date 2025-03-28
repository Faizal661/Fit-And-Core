import { inject, injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IAdminRepository } from "../Interface/IAdminRepository";

@injectable()
export class AdminRepository
  extends BaseRepository<IUserModel>
  implements IAdminRepository
{
  constructor() {
    super(UserModel);
  }

  async docsCount(field: string, value: string): Promise<number> {
    const docsCount = await this.model.countDocuments({ [field]: value });
    return docsCount;
  }

  async getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  > {
    const monthlyCounts = await this.model.aggregate([
      {
        $match: {
          $or: [{ role: "user" }, { role: "trainer" }],
          createdAt: {
            $gte: new Date(
              new Date().getFullYear() - 1,
              new Date().getMonth(),
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          role: "$_id.role",
          count: 1,
        },
      },
    ]);

    interface MonthlyDataEntry {
      users: number;
      trainers: number;
    }

    const formattedData: {
      [key: string]: MonthlyDataEntry;
    } = {};


    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setMonth(currentDate.getMonth() - i);
      const monthIndex = pastDate.getMonth();
      const year = pastDate.getFullYear();
      const key = `${months[monthIndex]}-${year}`;
      formattedData[key] = { users: 0, trainers: 0 };
    }

    monthlyCounts.forEach((item) => {
      const monthName = months[item.month - 1];
      const key = `${monthName}-${item.year}`;
      if (formattedData[key]) {
        const entry = formattedData[key];
        if (item.role === 'user') {
          entry.users = item.count;
        } else if (item.role === 'trainer') {
          entry.trainers = item.count;
        }
      }
    });

    const outputArray: {
      name: string;
      users: number;
      trainers: number;
    }[] = [];

    const orderedKeys = Object.keys(formattedData).sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");
      const dateA = new Date(`${yearA}-${months.indexOf(monthA) + 1}-01`);
      const dateB = new Date(`${yearB}-${months.indexOf(monthB) + 1}-01`);
      return dateA.getTime() - dateB.getTime();
    });

    orderedKeys.forEach((key) => {
      const [month] = key.split("-");
      outputArray.push({ name: month, ...formattedData[key] });
    });

    return outputArray;
  }
}
