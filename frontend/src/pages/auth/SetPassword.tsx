import { useState } from "react";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import LoginBody from "../../components/auth/LoginBody";
import setPasswordImage from "../../assets/images/calisthenics1.jpg";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successfully!");
  };

  return (
    <LoginBody
      imageSrc={setPasswordImage}
      welcomeMessage={AUTH_MESSAGES.SET_PASSWORD}
    >
      <div className="w-full max-w-md flex flex-col ">
        <label htmlFor="password" className="mt-2 text-slate-400">
          NEW PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="w-full border-b-1  mt-3 outline-0"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword" className="mt-6 text-slate-400">
          CONFIRM PASSWORD
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="w-full border-b-1  mt-3 outline-0"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          // className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          className="btn-primary mt-14 border-1 rounded-4xl py-2"
        >
          Submit
        </button>
      </div>
    </LoginBody>
  );
};

export default SetPassword;
