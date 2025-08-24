// src/app/(auth)/sign-up/[Token]/page.tsx

"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useVerifEmail } from "../../hooks/useVerifEmail";

export default function SignUpWithToken() {
  const hasCalled = useRef(false);
  const params = useParams();
  const token = params.Token;

  const { handleVerifEmail } = useVerifEmail();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || hasCalled.current) return;

      hasCalled.current = true;
      await handleVerifEmail({ token });
    };

    verifyEmail();
  }, [token, handleVerifEmail]);

  return <LoadingAnimation message="Mohon Tunggu..." />;
}
