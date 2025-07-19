import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import Typography from "@/components/Typography";
import { REG_EMAIL, REG_PASS } from "@/constants/regex";
import { useEmailMutation } from "../../hooks/LoginEmail";
import { ILoginForm } from "@/types/email";

export default function EmailForm(): JSX.Element {
  const methods = useForm<ILoginForm>({
    mode: "onTouched",
  });

  const { handleSubmit } = methods;
  const { handleLoginEmail } = useEmailMutation();
  const onSubmit = async (data: ILoginForm) => {
    await handleLoginEmail(data);
  };

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
        <Input
          id="password"
          type="password"
          label="Masukkan Password Anda"
          helperTextClassName="xl:text-base lg:text-base md:text-sm"
          className="w-full rounded-lg border-2 border-[#BBBCBF] p-2 lg:p-3 sm:p-2.5 placeholder:font-normal xl:text-base lg:text-base md:text-sm placeholder:xl:text-base placeholder:lg:text-base placeholder:md:text-sm"
          placeholder="Masukkan Password Anda"
          validation={{
            required: "Password tidak boleh kosong!",
            pattern: {
              value: REG_PASS,
              message:
                "Password harus mengandung huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter!",
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
            Masuk
          </Typography>
        </Button>
      </form>
    </FormProvider>
  );
}
