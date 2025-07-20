"use client";
import getUser from "@/app/(auth)/hooks/getUser";
import { Badge } from "@/components/Badge";
import Button from "@/components/buttons/Button";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import useUserStore from "@/store/userStore";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  name: string | null;
  email: string | null;
  photoProfile: null;
}

const Navbar = ({
  cartItemCount = 0,
  onCartClick,
  name,
  email,
  photoProfile,
}: NavbarProps) => {
  const router = useRouter();
  const { userData, setUserData } = useUserStore();
  const { getUserData, refetch } = getUser();
  useEffect(() => {
    const syncUser = async () => {
      if (!getUserData) {
        const { data } = await refetch();
        if (data) {
          setUserData(data.data);
        }
      } else {
        setUserData(getUserData.data);
      }
    };

    syncUser();
  }, [getUserData]);
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                B
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-xl font-bold text-foreground">
                PT. Bumi Rekayasa Persada Marketplace
              </h1>
              <p className=" text-sm text-muted-foreground">
                Pupuk Berkualitas untuk Pertanian Modern
              </p>
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative hover:bg-accent"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
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
            {name ? (
              <>
                <Button
                  onClick={() => router.push("/users-profile")}
                  variant="green"
                  className="w-full flex sm:flex-col md:flex-row gap-2 justify-center items-center outline-none border-none"
                >
                  <Typography
                    font="Inter"
                    weight="semibold"
                    className="text-white sm:text-xs md:text-xs lg:text-base text-center"
                  >
                    Hi, {name}
                  </Typography>

                  {photoProfile ? (
                    <>
                      <NextImage
                        src={process.env.NEXT_PUBLIC_IMAGE_URL + photoProfile}
                        alt="profile"
                        width={37}
                        height={36}
                        serverStaticImg={true}
                        className="rounded-full"
                        imgClassName="object-cover w-full h-full rounded-full"
                      />
                    </>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="37"
                      height="36"
                      viewBox="0 0 37 36"
                      fill="none"
                    >
                      <path
                        opacity="0.2"
                        d="M18.5 34.3125C27.4401 34.3125 34.6875 27.261 34.6875 18.5625C34.6875 9.86402 27.4401 2.8125 18.5 2.8125C9.55989 2.8125 2.3125 9.86402 2.3125 18.5625C2.3125 27.261 9.55989 34.3125 18.5 34.3125Z"
                        fill="black"
                      />
                      <path
                        d="M18.5 33.75C27.4401 33.75 34.6875 26.6985 34.6875 18C34.6875 9.30152 27.4401 2.25 18.5 2.25C9.55989 2.25 2.3125 9.30152 2.3125 18C2.3125 26.6985 9.55989 33.75 18.5 33.75Z"
                        fill="white"
                      />
                      <g opacity="0.2">
                        <path
                          d="M18.5 8.4375C16.2645 8.4375 14.4531 10.2007 14.4531 12.375C14.4531 14.5493 16.2645 16.3125 18.5 16.3125C20.7355 16.3125 22.5469 14.5493 22.5469 12.375C22.5469 10.2007 20.7355 8.4375 18.5 8.4375Z"
                          fill="black"
                        />
                        <path
                          d="M18.5 19.125C10.4071 19.1297 10.4062 24.1096 10.4062 24.1096V26.1346C10.4062 26.1346 11.9005 29.25 18.5 29.25C25.0995 29.25 26.5938 26.1346 26.5938 26.1346V24.1096C26.5938 24.1096 26.5938 19.1219 18.5016 19.125H18.5Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M18.5 7.875C16.2645 7.875 14.4531 9.63821 14.4531 11.8125C14.4531 13.9868 16.2645 15.75 18.5 15.75C20.7355 15.75 22.5469 13.9868 22.5469 11.8125C22.5469 9.63821 20.7355 7.875 18.5 7.875Z"
                        fill="#525B44"
                      />
                      <path
                        d="M18.5 18.5625C10.4071 18.5672 10.4062 23.5471 10.4062 23.5471V25.5721C10.4062 25.5721 11.9005 28.6875 18.5 28.6875C25.0995 28.6875 26.5938 25.5721 26.5938 25.5721V23.5471C26.5938 23.5471 26.5938 18.5594 18.5016 18.5625H18.5Z"
                        fill="#525B44"
                      />
                      <path
                        opacity="0.2"
                        d="M18.5 2.25C14.2068 2.25 10.0895 3.90937 7.05371 6.86307C4.01796 9.81677 2.3125 13.8228 2.3125 18C2.31505 18.0923 2.31844 18.1846 2.32266 18.2769C2.39958 14.1511 4.13755 10.2195 7.1628 7.32759C10.1881 4.43566 14.259 2.81441 18.5 2.8125C22.7403 2.81556 26.81 4.43732 29.8343 7.32913C32.8586 10.2209 34.5959 14.1519 34.6728 18.2769C34.6785 18.1846 34.6834 18.0923 34.6875 18C34.6875 13.8228 32.982 9.81677 29.9463 6.86307C26.9105 3.90937 22.7932 2.25 18.5 2.25Z"
                        fill="#525B44"
                      />
                    </svg>
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
                    className="text-white sm:text-[10px] min-[664px]:text-xs lg:text-base  hover:text-slate-200 hover:font-bold"
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
  );
};

export default Navbar;
