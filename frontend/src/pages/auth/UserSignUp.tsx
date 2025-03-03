


import { useState } from "react";
import UsernameEmailForm from "./UsernameEmailForm";
import OtpVerification from "./OtpVerification";
import SetPassword from "./SetPassword";
import { SignupProvider } from "../../context/SignupContext";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);

  return (
    <SignupProvider>
      <div>
        {step === 1 && <UsernameEmailForm onSuccess={(data) => { setUserData(data); setStep(2); }} />}
        {step === 2 && userData && <OtpVerification  onSuccess={() => setStep(3)} />}
        {step === 3 && userData && <SetPassword />}
      </div>
    </SignupProvider>
  );
};

export default Signup;
