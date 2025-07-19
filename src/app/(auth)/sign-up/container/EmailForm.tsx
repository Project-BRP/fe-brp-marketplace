"use client";
import { FormProvider, useForm } from "react-hook-form";

import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import Typography from "@/components/Typography";
import { REG_EMAIL, REG_PASS } from "@/constants/regex";

import { IRegisterData, IRegisterForm } from "@/types/email";
import { useRegister } from "../../hooks/useRegister";
import { useEffect } from "react";

export default function EmailForm({
  setDataregis,
  setDoneEmail,
}: {
  setDataregis: (data: IRegisterData) => void;
  setDoneEmail: (done: boolean) => void;
}): JSX.Element {
  const methods = useForm<IRegisterForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;
  const { handleRegister, isPending, isSuccess } = useRegister();
  const onSubmit = async (data: IRegisterForm) => {
    const { confirmPassword, ...body } = data;
    await handleRegister(body);
  };

  useEffect(() => {
    if (isSuccess) {
      setDoneEmail(true);
      setDataregis(methods.getValues());
    }
  }, [isSuccess, setDoneEmail, setDataregis, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="input w-full flex flex-col gap-2.5 justify-center items-center"
      >
        <Input
          id="name"
          label="Masukkan Nama Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Masukkan Nama Anda"
          validation={{
            required: "Nama tidak boleh kosong!",
          }}
        />
        <Input
          id="email"
          label="Masukkan Email Anda (pribadi atau kerja)"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Masukkan Email Anda"
          validation={{
            required: "Email tidak boleh kosong!",
            pattern: {
              value: REG_EMAIL,
              message: "Email tidak valid!",
            },
          }}
        />
        <Input
          id="password"
          type="password"
          label="Masukkan Kata Sandi Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Masukkan Kata Sandi Anda"
          validation={{
            required: "Password tidak boleh kosong!",
            pattern: {
              value: REG_PASS,
              message:
                "Password harus mengandung minimal huruf besar, huruf kecil, angka, bukan simbol, dan minimal 8 karakter!",
            },
          }}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Konfirmasi Kata Sandi Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Konfirmasi Kata Sandi Anda"
          validation={{
            required: "Konfirmasi Kata Sandi tidak boleh kosong!",
            validate: (value) =>
              value === methods.watch("password") || "Passwords tidak cocok!",
          }}
        />
        <Button
          type="submit"
          variant="green"
          className="w-full rounded-lg py-2"
          disabled={isPending || isSuccess}
        >
          <Typography
            variant="p"
            className="text-white text-[10px] xl:text-base lg:text-base md:text-sm"
          >
            Continue
          </Typography>
        </Button>
      </form>
    </FormProvider>
  );
}
