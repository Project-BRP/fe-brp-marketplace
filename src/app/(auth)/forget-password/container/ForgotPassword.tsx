"use client";
import Typography from "@/components/Typography";
import { MailCheck } from "lucide-react";
import React from "react";
import ResendButton from "../../components/ResendButton";
import { useForgotPasswordMutation } from "../../hooks/useForgotPassword";
import EmailForm from "./EmailForm";

export default function ForgotPassword(): JSX.Element {
  const { handleForgotPassword } = useForgotPasswordMutation();
  const [doneEmail, setDoneEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");
  return (
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
                Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan
                klik tautan tersebut untuk melanjutkan proses pendaftaran. Jika
                tidak menemukan email mungkin ada di folder Spam.
              </Typography>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 justify-center items-start">
              <Typography variant="p" className="font-semibold">
                Email tidak ada di inbox atau spam?
              </Typography>
              <ResendButton
                formData={{ email }}
                handleData={handleForgotPassword}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="title flex flex-col items-start justify-center w-full lg:gap-2">
            <Typography variant="h1" className="font-bold ">
              Lupa Password
            </Typography>
            <Typography
              variant="p"
              className="text-sm sm:text-base md:text-base"
            >
              Masukkan email Anda untuk mengatur ulang password.
            </Typography>
          </div>
          <EmailForm setEmail={setEmail} setDoneEmail={setDoneEmail} />
        </>
      )}
    </div>
  );
}
