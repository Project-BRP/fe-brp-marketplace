"use client";

import Typography from "@/components/Typography";
import Lottie from "lottie-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useVerifEmail } from "../../hooks/useVerifEmail";

export default function SignUpWithToken() {
  const [animationData, setAnimationData] = useState(null);
  const hasCalled = useRef(false);
  const params = useParams();
  const token = params.Token;

  const { handleVerifEmail } = useVerifEmail();

  useEffect(() => {
    fetch("/animation/plant.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || hasCalled.current) return;

      hasCalled.current = true;
      await handleVerifEmail({ token });
    };

    verifyEmail();
  }, [token]);

  if (!animationData) {
    return (
      <>
        {" "}
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50">
          <Typography
            variant="h1"
            className="text-2xl font-bold mt-4 font-[Poppins]"
          >
            Loading animation...
          </Typography>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50">
      <Lottie animationData={animationData} loop className="w-72 h-72" />
      <Typography
        variant="h1"
        className="text-2xl font-bold mt-4 font-[Poppins]"
      >
        Mohon Tunggu...
      </Typography>
    </div>
  );
}
