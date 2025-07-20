"use client";
import getUser from "@/app/(auth)/hooks/getUser";
import { Badge } from "@/components/Badge";
import NextImage from "@/components/NextImage";
import Button from "@/components/buttons/Button";

import Typography from "@/components/Typography";

import useUserStore from "@/store/userStore";
import { IUpdateUserData } from "@/types/auth";
import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileModal } from "./_container/profileModal";
import { useUpdateUser } from "./hooks/useUpdateUser";

export interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navbar = ({ cartItemCount = 0, onCartClick }: NavbarProps) => {
  const router = useRouter();
  const { userData, setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateUserProfile, isUpdating } = useUpdateUser();

  useEffect(() => {
    const syncUser = async () => {
      // Use existing data if available, otherwise refetch
      const dataToSync = getUserData?.data ?? (await refetch())?.data?.data;
      if (dataToSync) {
        setUserData(dataToSync);
      }
    };

    syncUser();
  }, [getUserData, refetch, setUserData]);

  // Correctly handles the FormData object from the modal
  const handleUpdate = async (formData: IUpdateUserData | FormData) => {
    try {
      await updateUserProfile(formData);
      const { data } = await refetch();
      if (data) {
        setUserData(data.data);
      }
    } catch (updateError) {
      console.error("Failed to update profile from Navbar");
    }
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50 flex justify-center items-center">
        <div className="px-4 py-4 w-full">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Logo and Company Name */}
            <div className="flex items-center gap-3 w-fit">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  B
                </span>
              </div>
              <div className="hidden sm:block">
                <Typography
                  variant="h6"
                  font="Inter"
                  weight="bold"
                  className="text-foreground"
                >
                  PT. Bumi Rekayasa Persada Marketplace
                </Typography>
                <Typography
                  variant="p"
                  font="Inter"
                  className="text-muted-foreground"
                >
                  Pupuk Berkualitas untuk Pertanian Modern
                </Typography>
              </div>
            </div>

            {/* Cart and User Actions */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-fit">
              {/* Cart Button */}
              <Button
                variant="outline"
                size="sm"
                className="relative hover:bg-accent flex gap-2 p-2"
                onClick={onCartClick}
              >
                <ShoppingCart className="size-4 sm:size-5 " />
                <Typography
                  variant="p"
                  font="Inter"
                  className="hidden sm:inline"
                >
                  Keranjang
                </Typography>

                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* User Profile / Auth Buttons */}
              {userData?.name ? (
                <>
                  <Button
                    onClick={() => setIsModalOpen(true)} // Open modal on click
                    variant="green"
                    className="w-full flex flex-row gap-2 justify-center items-center outline-none border-none p-2 min-w-min"
                  >
                    <Typography
                      variant="p"
                      font="Inter"
                      weight="semibold"
                      className="text-white text-center hidden min-[450px]:inline whitespace-nowrap"
                    >
                      Halo, {userData.name.split(" ").slice(0, 2).join(" ")}
                    </Typography>

                    {userData.photoProfile ? (
                      <NextImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL +
                          userData.photoProfile
                        }
                        alt="profile"
                        width={37}
                        height={36}
                        serverStaticImg={true}
                        className="rounded-full"
                        imgClassName="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <User className=" size-4 sm:size-5 text-white" />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/sign-up")}
                  >
                    <Typography
                      font="Inter"
                      weight="semibold"
                      className="text-black text-center sm:text-[10px] min-[664px]:text-xs lg:text-base hover:text-slate-500 hover:font-bold"
                    >
                      Daftar
                    </Typography>
                  </Button>
                  <Button
                    variant="green"
                    onClick={() => router.push("/sign-in")}
                    size="sm"
                  >
                    <Typography
                      font="Inter"
                      weight="semibold"
                      className="text-white sm:text-[10px] min-[664px]:text-xs lg:text-base hover:text-slate-200 hover:font-bold"
                    >
                      Masuk
                    </Typography>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Render the Modal */}
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
        />
      )}
    </>
  );
};

export default Navbar;
