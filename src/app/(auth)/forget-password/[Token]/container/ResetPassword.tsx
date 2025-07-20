import Typography from "@/components/Typography";
import PasswordForm from "./PasswordForm";

export default function ResetPassword(): JSX.Element {
  return (
    <div className="flex flex-col w-[330px] sm:w-[35%] min-h-[300px] sm:min-h-[400px] sm:min-w-[400px] lg:min-w-[450px] sm:px-12 sm:py-16 py-8 px-6 rounded-lg justify-start items-center gap-8 sm:gap-8 bg-white">
      <div className="title flex flex-col items-start justify-center w-full lg:gap-2">
        <Typography
          variant="h1"
          className="text-xl font-bold sm:text-3xl md:text-3xl"
        >
          Reset Password
        </Typography>
        <Typography variant="p" className="text-sm sm:text-base md:text-base">
          Masukkan password baru Anda.
        </Typography>
      </div>
      <PasswordForm />
    </div>
  );
}
