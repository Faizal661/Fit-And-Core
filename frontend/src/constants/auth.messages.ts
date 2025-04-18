export enum AUTH_MESSAGES { 
    LOGIN_MESSAGE="You're back, awesome!",
    SIGNUP_MESSAGE= "Welcome to the Fit-Core, You are almost ready.",

    SET_PASSWORD="Enter Your New Password",
    RESET_PASSWORD_MESSAGE="No worries, we can reset your password",
    PASSWORD_RESET_SUCCESS="Password Reset Successfully",

    ENTER_OTP="Enter the 6-digit OTP sent to your email",
    OTP_SENT="OTP shared to your Email",
    OTP_RESENT="OTP Resended to your Email",
    INVALID_OTP="Invalid OTP code",
    OTP_SUCCESS="OTP Verified",
    
    ACCOUNT_CREATED="Account registered successfully!. Now SignIn into your account",
    LOGIN_PROGRESS="Completing login...",
    LOGIN_SUCCESS="Login success",
    LOGOUT_SUCCESS="Log out success",
    LOGIN_FAILED="Login failed",
    INVALID_EMAIL="not a registred Email.",
    INVALID_CREDENTIALS="Invalid email or password",
    ACCOUNT_BLOCKED="Your account is blocked. Please contact support.",

    GOOGLE_AUTH_FAIL="Google Authentication failed",
    GOOGLE_AUTH_ERROR="There was an error processing your login. Please try again.",

    SERVER_ERROR="Server error, please try again",
    SESSION_EXPIRED="Session expired, please login again",
};