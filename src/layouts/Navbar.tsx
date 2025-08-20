"use client";

import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import getUser from "@/app/(auth)/hooks/getUser";
import { useGetCompanyProfile } from "@/app/admin/settings/hooks/useCompanyProfile";
import { Badge } from "@/components/Badge";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import useUserStore from "@/store/userStore";
import { IUpdateUserData } from "@/types/auth";
import { ProfileModal } from "./_container/profileModal";
import { useGetCompanyInfo } from "./hooks/useCompanyInfo";
import { useLogout } from "./hooks/useLogout";
import { useUpdateUser } from "./hooks/useUpdateUser";

export interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navbar = ({ cartItemCount = 0, onCartClick }: NavbarProps) => {
  const router = useRouter();
  const { userData, setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();
  const { data: companyInfo } = useGetCompanyInfo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUserProfile, isUpdating } = useUpdateUser();
  const { handleLogout, isLoggingOut } = useLogout();
  const { data: companyProfile } = useGetCompanyProfile();

  const CompanyLogoUrl = companyProfile?.imageUrl
    ? companyProfile.imageUrl
    : companyInfo?.logoUrl;

  // Effect to synchronize user data on component mount
  useEffect(() => {
    const syncUser = async () => {
      const dataToSync = getUserData?.data ?? (await refetch())?.data?.data;
      if (dataToSync) {
        setUserData(dataToSync);
      }
    };

    syncUser();
  }, [getUserData, refetch, setUserData]);

  // Handler for updating user profile
  const handleUpdate = async (formData: IUpdateUserData | FormData) => {
    try {
      await updateUserProfile(formData);
      const { data } = await refetch();
      if (data) {
        setUserData(data.data);
      }
    } catch (updateError) {
      console.error("Failed to update profile from Navbar:", updateError);
    }
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Logo and Company Name */}
            <div className="flex items-center gap-3">
              {CompanyLogoUrl ? (
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${CompanyLogoUrl}`}
                  alt="Company Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                  imgClassName="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    B
                  </span>
                </div>
              )}
              <div className="hidden sm:block">
                <Typography
                  variant="h6"
                  weight="bold"
                  className="text-foreground"
                >
                  {companyInfo?.companyName || "Bumi Rekayasa Persada"}
                </Typography>
                <Typography
                  variant="p"
                  className="text-muted-foreground text-sm"
                >
                  Marketplace
                </Typography>
              </div>
            </div>

            {/* Actions: Cart and User/Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="base"
                className="relative h-10 p-2 flex items-center gap-2"
                disabled={!userData.name}
                onClick={onCartClick}
              >
                <ShoppingCart className="size-5" />
                <span className="hidden sm:inline">Keranjang</span>
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {userData?.name ? (
                <>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="green"
                    size="base"
                    className="h-10 p-2 flex items-center gap-2"
                  >
                    <span className="hidden min-[450px]:inline whitespace-nowrap font-semibold">
                      Halo, {userData.name.split(" ")[0]}
                    </span>
                    {userData.photoProfile ? (
                      <NextImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL +
                          userData.photoProfile
                        }
                        alt="profile"
                        width={28}
                        height={28}
                        className="rounded-full"
                        imgClassName="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <User className="size-5 text-white" />
                    )}
                  </Button>
                  {userData.role === "ADMIN" && (
                    <Button
                      variant="yellow"
                      size="base"
                      onClick={() => router.push("/admin")}
                      className="h-10 px-4 hidden md:flex"
                    >
                      Admin Panel
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="base"
                    onClick={() => router.push("/sign-up")}
                    className="h-10 px-4"
                  >
                    Daftar
                  </Button>
                  <Button
                    variant="green"
                    size="base"
                    onClick={() => router.push("/sign-in")}
                    className="h-10 px-4"
                  >
                    Masuk
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
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
};

export default Navbar;
