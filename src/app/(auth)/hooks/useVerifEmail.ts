// src/hooks/useVerifEmail.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api"; // pastikan path ini benar
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { ApiResponse } from "@/types/api";
import { IAuthResponse, IVerifEmail } from "@/types/email";
import toast from "react-hot-toast";

export function useVerifEmail(successVerif: React.MutableRefObject<boolean>) {
  const {
    mutateAsync: handleVerifEmail,
    isPending,
    data: handleVerifEmailData,
    isSuccess,
    isError,
  } = useMutation<IAuthResponse, AxiosError<ApiError>, IVerifEmail>({
    mutationKey: ["verifEmail"],
    mutationFn: async (data: IVerifEmail) => {
      const res = await api.post(`/auth/verify-email/${data.token}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Verifikasi Email berhasil");
      successVerif.current = true;
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        "Terjadi kesalahan saat verifikasi email.";
      toast.error(message);
    },
  });
  return {
    handleVerifEmail,
    isPending,
    handleVerifEmailData,
    isSuccess,
    isError,
  };
}
