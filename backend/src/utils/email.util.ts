import nodemailer from "nodemailer";
import { CustomError } from "../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../constants/http-response.constants";
import { env } from "../config/env.config";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT), // Typically 587 for TLS or 465 for SSL
  secure: Boolean(env.SMTP_SECURE), // true for 465, false for other ports
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const sendEmail = async (toEmail: string, otp: string) => {
  try {
    const mailOptions = {
      from: {
        name: "Fit & Core Team",
        address: env.SMTP_USERNAME,
      },
      to: toEmail,
      subject: "FIT & CORE : SIGNUP OTP",
      text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
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
            <span style="color: #64748b;">Keep your verification code safe – don't share it with anyone.</span>
          </p>
        </div>
      </div>
    </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log(
    //   "Email sent successfully!",
    //   toEmail,
    //   "Message ID:",
    //   info.messageId
    // );

    // return info;
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

// // Optional: Email verification method
// export const verifyEmailTransport = async () => {
//   try {
//     await transporter.verify();
//     console.log("Email transport is ready to send messages");
//     return true;
//   } catch (error) {
//     console.error("Email transport verification failed:", error);
//     return false;
//   }
// };

// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import { CustomError } from "../errors/CustomError";
// import { HttpResCode } from "../constants/response.constants";
// import { env } from "../config/env.config";

// const sesClient = new SESClient({
//   region: env.AWS_REGION,
//   credentials: {
//     accessKeyId: env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export const sendEmail = async (toEmail: string, otp: string) => {
//   try {
//     const params = {
//       Source: env.SES_EMAIL_FROM,
//       Destination: {
//         ToAddresses: [toEmail],
//       },
//       Message: {
//         Subject: { Data: "FIT & CORE : SIGNUP OTP" },
//         Body: {
//           Html: {
//             Data: `<div style="
//                       max-width: 400px;
//                       margin: 20px auto;
//                       padding: 20px;
//                       background-color: #ffffff;
//                       border-radius: 10px;
//                       box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//                       text-align: center;
//                       font-family: Arial, sans-serif;
//                       border: 1px solid #ddd;
//                     ">
//                       <h2 style="
//                         color: #333;
//                         font-size: 24px;
//                         margin-bottom: 20px;
//                       ">
//                         🔐 Your Verification Code
//                       </h2>

//                       <p style="color: #666; font-size: 16px; margin-bottom: 25px;">
//                         Use the OTP below to verify your email. This code will expire in <strong style="color: #e63946;">5 minutes</strong>.
//                       </p>

//                       <div style="
//                         display: inline-block;
//                         padding: 12px 20px;
//                         font-size: 22px;
//                         font-weight: bold;
//                         color: #ffffff;
//                         background-color: #007bff;
//                         border-radius: 8px;
//                         letter-spacing: 5px;
//                         margin-bottom: 20px;
//                       ">
//                         ${otp}
//                       </div>

//                       <p style="color: #666; font-size: 14px;">
//                         If you didn't request this, please ignore this email.
//                       </p>

//                       <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
//                         Fit & Core Team 💪 | Do not share this OTP with anyone.
//                       </p>
//                     </div>
//                     `,
//           },
//           Text: {
//             Data: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
//           },
//         },
//       },
//     };

//     const command = new SendEmailCommand(params);
//     await sesClient.send(command);
//     console.log("Email sent successfully!", toEmail);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new CustomError(error.message, HttpResCode.INTERNAL_SERVER_ERROR);
//     } else {
//       throw new CustomError(
//         "Failed to send email: Unknown error occurred",
//         HttpResCode.INTERNAL_SERVER_ERROR
//       );
//     }
//   }
// };
