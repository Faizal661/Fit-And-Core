import { useState } from "react";

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
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
          <p className="text-gray-500 text-center mt-2">Enter your new password</p>
  
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded-md mt-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-2 rounded-md mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
  
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

export default SetPassword