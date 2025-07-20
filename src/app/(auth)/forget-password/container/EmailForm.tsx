"use client";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import Typography from "@/components/Typography";
import { REG_EMAIL } from "@/constants/regex";
import { useForgotPasswordMutation } from "../../hooks/useForgotPassword";
import { IForgotPasswordForm } from "@/types/auth";
import { useEffect } from "react";

export default function EmailForm({
  setEmail,
  setDoneEmail,
}: {
  setEmail: (email: string) => void;
  setDoneEmail: (done: boolean) => void;
}): JSX.Element {
  const methods = useForm<IForgotPasswordForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;
  const { handleForgotPassword, isSuccess } = useForgotPasswordMutation();
  const onSubmit = async (data: IForgotPasswordForm) => {
    await handleForgotPassword(data);
  };

  useEffect(() => {
    if (isSuccess) {
      setDoneEmail(true);
      setEmail(methods.getValues().email);
    }
  }, [isSuccess, setDoneEmail, setEmail, methods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="input w-full flex flex-col gap-4 justify-center items-center"
      >
        <Input
          id="email"
          label="Masukkan Email Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Input Your Email"
          validation={{
            required: "Email tidak boleh kosong!",
            pattern: {
              value: REG_EMAIL,
              message: "Email tidak valid!",
            },
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
            Kirim
          </Typography>
        </Button>
      </form>
    </FormProvider>
  );
}
