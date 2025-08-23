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
    const { setUserData } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);
    const { getUserData } = getUser();

    useEffect(() => {
      const checkAuth = () => {
        // Cek data pengguna di state management (Zustand)
        if (useUserStore.getState().userData?.userId) {
          router.replace("/dashboard");
          return;
        }

        // Jika tidak ada di state, cek di cache React Query
        if (getUserData?.data) {
          setUserData(getUserData.data);
          router.replace("/dashboard");
        } else {
          // Jika tidak ada di mana pun, anggap belum login
          setIsLoading(false);
        }
      };

      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
