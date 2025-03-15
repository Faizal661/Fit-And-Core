import { useState } from "react";
import UsernameEmailForm from "./UsernameEmailForm";
import OtpVerification from "./OtpVerification";
import SetPassword from "./SetPassword";
import { SignupProvider } from "../../../context/SignupContext";

const Signup = () => {
  const [step, setStep] = useState(1);
  
  return (
    <SignupProvider>
      <div>
        {step === 1 && (<UsernameEmailForm onSuccess={ () =>  setStep(2)}/>)}
        {step === 2 && (<OtpVerification onSuccess={() => setStep(3)} /> )}
        {step === 3 && <SetPassword />}
      </div>
    </SignupProvider>
  );
};

export default Signup;
 