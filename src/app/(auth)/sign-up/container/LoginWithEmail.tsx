import Typography from "@/components/Typography";
import EmailForm from "./EmailForm";
import { useRouter } from "next/navigation";
import { IoArrowForward } from "react-icons/io5";
import React from "react";
import { MailCheck } from "lucide-react";
import ResendButton from "../../components/ResendButton";

export default function LoginWithEmail(): JSX.Element {
  const [doneEmail, setDoneEmail] = React.useState(false);
  const [dataRegis, setDataRegis] = React.useState({
    email: "",
    name: "",
    password: "",
  });
  const router = useRouter();
  return (
    <>
      <div
        className={`flex flex-col w-[330px] sm:w-[35%] h-fit min-h-[300px] sm:min-h-[400px]    sm:px-12  sm:py-16 py-8  rounded-lg ${
          doneEmail
            ? "justify-center px-4 sm:min-w-[420px] lg:min-w-[500px]"
            : "justify-start px-6 sm:min-w-[400px] lg:min-w-[450px]"
        } items-center gap-10 sm:gap-14 bg-white`}
      >
        {doneEmail ? (
          <>
            <div className="flex flex-col gap-8">
              <div className="title flex flex-col items-center justify-between h-full w-full gap-2 sm:gap-4 ">
                <MailCheck className="size-20 text-green-500" />
                <Typography variant="h3" className="font-bold text-center">
                  SILAKAN CEK EMAIL ANDA
                </Typography>
                <Typography variant="p" className="text-justify">
                  Kami telah mengirimkan tautan verifikasi ke email Anda.
                  Silakan klik tautan tersebut untuk melanjutkan proses
                  pendaftaran. Jika tidak menemukan email mungkin ada di folder
                  Spam.
                </Typography>
              </div>
              <div className="flex flex-col gap-2 sm:gap-4 justify-center items-start">
                <Typography variant="p" className="font-semibold">
                  Email tidak ada di inbox atau spam?
                </Typography>
                <ResendButton formData={dataRegis} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="title flex flex-col items-start justify-center w-full lg:gap-2">
              <Typography
                variant="h1"
                className="text-xl font-bold sm:text-3xl md:text-3xl"
              >
                Daftar
              </Typography>
              <Typography
                variant="p"
                className="text-sm sm:text-base md:text-base"
              >
                Silakan daftar untuk membuat akun baru.
              </Typography>
            </div>
            <EmailForm
              setDoneEmail={setDoneEmail}
              setDataregis={setDataRegis}
            />
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
          </>
        )}
      </div>
    </>
  );
}
