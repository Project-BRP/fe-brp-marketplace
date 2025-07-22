"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";

import getUser from "@/app/(auth)/hooks/getUser";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import useUserStore from "@/store/userStore";
import { IUpdateUserData } from "@/types/auth";
import { ProfileModal } from "./_container/profileModal";
import { useLogout } from "./hooks/useLogout";
import { useUpdateUser } from "./hooks/useUpdateUser";

export default function AdminNavbar() {
  const { userData, setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUserProfile, isUpdating } = useUpdateUser();
  const { handleLogout, isLoggingOut } = useLogout();
  useEffect(() => {
    const syncUser = async () => {
      const dataToSync = getUserData?.data ?? (await refetch())?.data?.data;
      if (dataToSync) {
        setUserData(dataToSync);
      }
    };
    syncUser();
  }, [getUserData, refetch, setUserData]);

  const handleUpdate = async (formData: IUpdateUserData | FormData) => {
    try {
      await updateUserProfile(formData);
      const { data } = await refetch();
      if (data) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error("Failed to update profile from Admin Navbar:", error);
    }
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-40">
        {/* The container is now inside the header to constrain content but not the background */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-end h-16">
            {userData?.name ? (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="ghost"
                className="h-10 p-2 flex items-center gap-3"
              >
                <div className="text-right hidden sm:block">
                  <Typography variant="p" weight="semibold" className="text-sm">
                    {userData.name ? userData.name : "Admin User"}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-xs text-muted-foreground"
                  >
                    {userData.email ? userData.email : "admin@example.com"}
                  </Typography>
                </div>
                {userData.photoProfile ? (
                  <NextImage
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_URL + userData.photoProfile
                    }
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full"
                    imgClassName="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
              </Button>
            ) : (
              // Skeleton loader for when user data is not yet available
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </header>

      {userData && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={{
            name: userData.name,
            email: userData.email,
            photoProfile: userData.photoProfile || null,
          }}
          onUpdate={handleUpdate}
          isUpdating={isUpdating}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      )}
    </>
  );
}
