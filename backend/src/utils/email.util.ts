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
                            max-width: 400px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            font-family: Arial, sans-serif;
                            border: 1px solid #ddd;
                          ">
                            <h2 style="
                              color: #333;
                              font-size: 24px;
                              margin-bottom: 20px;
                            ">
                              🔐 Your Verification Code
                            </h2>
      
                            <p style="color: #666; font-size: 16px; margin-bottom: 25px;">
                              Use the OTP below to verify your email. This code will expire in <strong style="color: #e63946;">5 minutes</strong>.
                            </p>
      
                            <div style="
                              display: inline-block;
                              padding: 12px 20px;
                              font-size: 22px;
                              font-weight: bold;
                              color: #ffffff;
                              background-color: #007bff;
                              border-radius: 8px;
                              letter-spacing: 5px;
                              margin-bottom: 20px;
                            ">
                              ${otp}
                            </div>
      
                            <p style="color: #666; font-size: 14px;">
                              If you didn't request this, please ignore this email.
                            </p>
      
                            <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
                              Fit & Core Team 💪 | Do not share this OTP with anyone.
                            </p>
                          </div>
                          `,
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
