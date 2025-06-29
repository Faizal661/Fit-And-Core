import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = false,
  className = "",
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(length)
      .fill("")
      .map((_, index) => value[index] || "")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newValues = Array(length)
      .fill("")
      .map((_, index) => value[index] || "");
    setOtpValues(newValues);
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = inputValue;
    setOtpValues(newOtpValues);

    const otpString = newOtpValues.join("");
    onChange(otpString);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all fields are filled
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (pastedData) {
      const newValues = Array(length)
        .fill("")
        .map((_, index) => pastedData[index] || "");
      setOtpValues(newValues);
      onChange(pastedData);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newValues.findIndex((val) => !val);
      const focusIndex =
        nextEmptyIndex === -1
          ? length - 1
          : Math.min(nextEmptyIndex, pastedData.length);
      inputRefs.current[focusIndex]?.focus();

      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className={`flex justify-center gap-3 ${className}`}>
      {otpValues.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
          } ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:border-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
