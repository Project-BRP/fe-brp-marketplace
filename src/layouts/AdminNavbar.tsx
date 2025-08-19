"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";

import getUser from "@/app/(auth)/hooks/getUser";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { IUpdateUserData } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProfileModal } from "./_container/profileModal";
import { useLogout } from "./hooks/useLogout";
import { useUpdateUser } from "./hooks/useUpdateUser";

export default function AdminNavbar() {
  const { userData, setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUserProfile, isUpdating } = useUpdateUser();
  const { handleLogout, isLoggingOut } = useLogout();
  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: async () => {
      const res = await api.get("/config/logo");
      return res.data.data;
    },
  });

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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {companyProfile?.imageUrl ? (
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${companyProfile.imageUrl}`}
                  alt="Company Logo"
                  width={36}
                  height={36}
                  className="rounded-full"
                  imgClassName="object-cover w-full h-full rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    B
                  </span>
                </div>
              )}
              <Typography variant="h6" weight="bold">
                Admin Panel
              </Typography>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                variant="green"
                size="base"
                onClick={() => router.push("/dashboard")}
                className="h-10 px-4 hidden md:flex"
              >
                Dashboard
              </Button>
              {userData?.name ? (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="ghost"
                  className="h-10 p-2 flex items-center gap-3"
                >
                  <div className="text-right hidden sm:block">
                    <Typography
                      variant="p"
                      weight="semibold"
                      className="text-sm"
                    >
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
                        process.env.NEXT_PUBLIC_IMAGE_URL +
                        userData.photoProfile
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
        </div>
      </header>

      {userData && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={{
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
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
