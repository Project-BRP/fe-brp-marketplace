"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import getUser from "@/app/(auth)/hooks/getUser";
import useUserStore from "@/store/userStore";

/**
 * A Higher-Order Component (HOC) that protects a component from being accessed
 * by non-admin users. It verifies the user's session by calling the /me endpoint
 * if the user data is not already in the Zustand store.
 *
 * @param WrappedComponent The component to protect.
 */
export default function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  const WithAdminAuth = (props: P) => {
    const router = useRouter();
    const { userData, setUserData } = useUserStore();
    const [isLoading, setIsLoading] = useState(true);
    const { refetch } = getUser();

    useEffect(() => {
      const verifyAccess = async () => {
        // Case 1: User data is already in the store. Check the role directly.
        if (userData && userData.userId) {
          if (userData.role !== "ADMIN") {
            router.replace("/dashboard"); // Not an admin, redirect.
          } else {
            setIsLoading(false); // Is an admin, allow access.
          }
          return;
        }

        // Case 2: No user data in store. Attempt to fetch it from the API.
        // The browser will automatically send the httpOnly cookie.
        try {
          const { data: response, isError } = await refetch();

          // If the API call fails or returns an error, the user is not authenticated.
          if (isError || !response?.data) {
            router.replace("/sign-in");
            return;
          }

          const user = response.data;
          setUserData(user); // Populate the store with fetched data.

          // Now, check the role from the newly fetched data.
          if (user.role !== "ADMIN") {
            router.replace("/dashboard");
          } else {
            setIsLoading(false); // Is an admin, allow access.
          }
        } catch (error) {
          // Any exception during fetch also means authentication failed.
          console.error("Admin auth check failed:", error);
          router.replace("/sign-in");
        }
      };

      verifyAccess();
    }, [userData, router, refetch, setUserData]);

    // While checking the user's role, display a loading state.
    if (isLoading) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <User className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      );
    }

    // If the user is an admin, render the component they were trying to access.
    return <WrappedComponent {...props} />;
  };

  // Set a display name for easier debugging in React DevTools
  WithAdminAuth.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAdminAuth;
}
