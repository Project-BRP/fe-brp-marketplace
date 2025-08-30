// src/components/LoadingAnimation.tsx

"use client";

import clsxm from "@/lib/clsxm";
import useAnimationStore from "@/store/animationStore";
import Lottie from "lottie-react";
import { useEffect } from "react";
import Typography from "./Typography";

interface LoadingAnimationProps {
  message: string;
  className?: string;
}

export default function LoadingAnimation({
  message,
  className,
}: LoadingAnimationProps) {
  const { animationData, fetchAnimationData } = useAnimationStore();

  useEffect(() => {
    if (!animationData) {
      fetchAnimationData();
    }
  }, [animationData, fetchAnimationData]);

  if (!animationData) {
    return (
      <div
        className={clsxm(
          "flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50",
          className,
        )}
      >
        <Typography
          variant="h1"
          className="text-2xl font-bold mt-4 font-[Poppins]"
        >
          Loading animation...
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={clsxm(
        "flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50",
        className,
      )}
    >
      <Lottie animationData={animationData} loop className="w-72 h-72" />
      <Typography
        variant="h1"
        className="text-2xl font-bold mt-4 font-[Poppins]"
      >
        {message}
      </Typography>
    </div>
  );
}
