"use client";

import Typography from "@/components/Typography";
import Lottie from "lottie-react";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import { useEffect, useRef, useState } from "react";
import { useVerifEmail } from "../../hooks/useVerifEmail";

export default function SignUpWithToken() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState(null);
  const successVerif = useRef(false);
  const hasCalled = useRef(false);
  const params = useParams();
  const token = params.Token;

  const { handleVerifEmail } = useVerifEmail(successVerif);

  useEffect(() => {
    fetch("/animation/plant.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  useEffect(() => {
    if (!token || hasCalled.current) return;

    hasCalled.current = true;
    handleVerifEmail({ token });
  }, [token]);

  useEffect(() => {
    if (successVerif.current) {
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [successVerif.current]);

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
