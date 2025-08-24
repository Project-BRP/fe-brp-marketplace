// src/components/LoadingAnimation.tsx

"use client";

import useAnimationStore from "@/store/animationStore";
import Lottie from "lottie-react";
import { useEffect } from "react";
import Typography from "./Typography";

interface LoadingAnimationProps {
  message: string;
}

export default function LoadingAnimation({ message }: LoadingAnimationProps) {
  const { animationData, fetchAnimationData } = useAnimationStore();

  useEffect(() => {
    if (!animationData) {
      fetchAnimationData();
    }
  }, [animationData, fetchAnimationData]);

  if (!animationData) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50">
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
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-green-50">
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
