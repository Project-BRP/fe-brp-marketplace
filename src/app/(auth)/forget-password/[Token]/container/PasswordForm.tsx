"use client";
import Typography from "@/components/Typography";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import { REG_PASS } from "@/constants/regex";
import { IResetPasswordForm } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../../../hooks/useResetPassword";

export default function PasswordForm(): JSX.Element {
  const { Token } = useParams();
  const route = useRouter();
  const methods = useForm<IResetPasswordForm>({
    mode: "onTouched",
  });

  const { handleSubmit, watch } = methods;
  const { handleResetPassword, isSuccess } = useResetPasswordMutation();
  const onSubmit = async (data: IResetPasswordForm) => {
    await handleResetPassword({ ...data, token: Token as string });
  };

  useEffect(() => {
    if (isSuccess) {
      route.push("/sign-in");
    }
  }, [isSuccess, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="input w-full flex flex-col gap-4 justify-center items-center"
      >
        <Input
          id="password"
          type="password"
          label="Masukkan Password Baru Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Masukkan Password Baru Anda"
          validation={{
            required: "Password tidak boleh kosong!",
            pattern: {
              value: REG_PASS,
              message:
                "Password harus mengandung huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter!",
            },
          }}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Konfirmasi Password Baru Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Konfirmasi Password Baru Anda"
          validation={{
            required: "Konfirmasi password tidak boleh kosong!",
            validate: (value) =>
              value === watch("password") || "Password tidak cocok!",
          }}
        />
        <Button
          type="submit"
          variant="green"
          className="w-full rounded-lg py-2"
        >
          <Typography
            variant="p"
            className="text-white text-[10px] xl:text-base lg:text-base md:text-sm"
          >
            Reset Password
          </Typography>
        </Button>
      </form>
    </FormProvider>
  );
}
