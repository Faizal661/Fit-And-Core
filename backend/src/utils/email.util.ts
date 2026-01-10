import { Resend } from "resend";
import CustomError from "../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../constants/http-response.constants";
import env from "../config/env.config";

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (toEmail: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Fit & Core <hello@fitandcore.shop>",
      to: toEmail,
      subject: "FIT & CORE : SIGNUP OTP",
      html: `<div style="
      max-width: 500px;
      margin: 20px auto;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
    ">
      <div style="
        padding: 40px 20px;
        text-align: center;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%);
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
          background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
        ">
        </div>
        <h1 style="
          color: #ffffff;
          font-size: 28px;
          margin: 0 0 10px 0;
          font-weight: bold;
          position: relative;
        ">
          Verify Your Email
        </h1>
        <div style="
          width: 40px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          margin: 0 auto 20px auto;
          border-radius: 2px;
        "></div>
        <p style="
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin: 0;
          position: relative;
        ">
          Your verification code is below
        </p>
      </div>

      <div style="
        background: white;
        padding: 40px 20px;
        border-radius: 0 0 16px 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      ">
        <div style="
          text-align: center;
          margin-bottom: 30px;
        ">
          <div style="
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              color: white;
              letter-spacing: 8px;
            ">${otp}</span>
          </div>
        </div>

        <p style="
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
          text-align: center;
        ">
          This code will expire in <strong style="color: #dc2626;">5 minutes</strong>.<br>
          If you didn't request this code, you can safely ignore this email.
        </p>

        <div style="
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          margin-top: 20px;
        ">
          <p style="
            margin: 0;
            color: #94a3b8;
            font-size: 12px;
          ">
            Fit & Core Team 💪<br>
            <span style="color: #64748b;">Keep your verification code safe – don't share it with annyone.</span>
          </p>
        </div>
      </div>
    </div>`,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new CustomError(error.message, HttpResCode.INTERNAL_SERVER_ERROR);
    } else {
      throw new CustomError(
        HttpResMsg.FAILED_SEND_EMAIL,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};
