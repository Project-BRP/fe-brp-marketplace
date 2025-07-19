"use client";
import Button from "@/components/buttons/Button";
import { useEffect, useState } from "react";

import { IRegisterData } from "@/types/email";
import { useRegister } from "../hooks/useRegister";

const RESEND_TIME = 60; // Durasi countdown dalam detik
const STORAGE_KEY = "resend_expiry_time";
const isBrowser = typeof window !== "undefined";

export default function ResendButton({
  formData,
}: {
  formData: IRegisterData;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { handleRegister } = useRegister();
  useEffect(() => {
    // Cek apakah ada waktu expiry yang tersimpan di localStorage
    if (isBrowser) {
      const storedExpiry = localStorage.getItem(STORAGE_KEY);
      if (storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        const now = Math.floor(Date.now() / 1000);
        const remainingTime = expiryTime - now;
        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    const expiryTime = Math.floor(Date.now() / 1000) + RESEND_TIME;
    if (isBrowser) localStorage.setItem(STORAGE_KEY, expiryTime.toString());
    setTimeLeft(RESEND_TIME);

    await handleRegister(formData);
  };

  return (
    <Button
      type="button"
      variant="green"
      onClick={handleResend}
      disabled={timeLeft > 0}
      className={`w-full text-white py-2 ${
        timeLeft > 0
          ? "background-gray cursor-not-allowed text-["
          : "bg-[#525B44]"
      } disabled:bg-[#D9D9D980] disabled:text-[#00000099] text-[10px] lg:text-[15px] md:text-xs`}
    >
      {timeLeft > 0 ? `Resend ${timeLeft}s` : "Resend Email"}
    </Button>
  );
}
