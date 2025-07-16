import Typography from "@/components/Typography";
import EmailForm from "./EmailForm";
import { useRouter } from "next/navigation";
import { IoArrowForward } from "react-icons/io5";

export default function LoginWithEmail(): JSX.Element {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col w-[330px] sm:w-[35%] h-fit min-h-[300px] sm:min-h-[400px] sm:min-w-[400px] lg:min-w-[450px] sm:px-12 sm:py-16 py-8 px-6 rounded-lg justify-start items-center gap-10 sm:gap-14 bg-white">
        <div className="title flex flex-col items-start justify-center w-full lg:gap-2">
          <Typography
            variant="h1"
            className="text-xl font-bold sm:text-3xl md:text-3xl"
          >
            Daftar
          </Typography>
          <Typography variant="p" className="text-sm sm:text-base md:text-base">
            Silakan daftar untuk membuat akun baru.
          </Typography>
        </div>
        <EmailForm />
        <div className="loginInstead flex flex-row items-center justify-center gap-1">
          <Typography
            variant="p"
            className="text-xs sm:text-base md:text-base min-[300px]:text-[9px]"
          >
            Sudah punya akun?
          </Typography>
          <div className="flex flex-row items-center text-black justify-center gap-1 cursor-pointer hover:border-black/50  hover:text-black/50">
            <Typography
              variant="p"
              italic={true}
              className="text-xs sm:text-base md:text-base font-bold hover:text-black/50 min-[300px]:text-[9px]"
              onClick={() => router.push("/sign-in")}
            >
              Masuk
            </Typography>
            <IoArrowForward className="w-3 h-3" />
          </div>
        </div>
      </div>
    </>
  );
}
