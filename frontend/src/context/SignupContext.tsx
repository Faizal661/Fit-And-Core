import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SignupData {
  username: string ;
  email: string;
}

interface SignupContextProps {
  userData: SignupData | null;
  setUserData: (data: SignupData) => void;
  resetSignup: () => void;
}

const SignupContext = createContext<SignupContextProps | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<SignupData | null>(null);

  const resetSignup = () => setUserData(null);

  useEffect(() => {
    console.log('userData in context updated:', userData);
  }, [userData]);

  return (
    <SignupContext.Provider value={{ userData, setUserData, resetSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignupContext = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignupContext must be used within a SignupProvider");
  }
  return context;
};
