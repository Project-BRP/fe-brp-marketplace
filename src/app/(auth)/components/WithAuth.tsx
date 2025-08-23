// src/app/(auth)/components/withAuth.tsx

"use client";

import getUser from "@/app/(auth)/hooks/getUser";
import useUserStore from "@/store/userStore";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  const WithAuth = (props: P) => {
    const router = useRouter();
    const { userData, setUserData } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);
    const { refetch } = getUser();

    useEffect(() => {
      const checkAuth = async () => {
        if (userData && userData.userId) {
          router.replace("/dashboard");
          return;
        }

        try {
          const { data: response, isError } = await refetch();
          console.log(response);
          if (!isError && response?.data) {
            setUserData(response.data);
            router.replace("/dashboard");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [userData, router, refetch, setUserData]);

    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <User className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
}
