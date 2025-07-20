import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { IAuthResponse, IResetPasswordVariable } from "@/types/auth";
import toast from "react-hot-toast";

export function useResetPasswordMutation() {
  const {
    mutate: handleResetPassword,
    isPending,
    data: handleResetPasswordData,
    isSuccess,
    isError,
  } = useMutation<IAuthResponse, AxiosError<ApiError>, IResetPasswordVariable>({
    mutationFn: async ({
      password,
      confirmPassword,
      token,
    }: IResetPasswordVariable) => {
      const res = await api.post("/auth/reset-password", {
        password,
        confirmPassword,
        token,
      });
      return res.data;
    },
    onSuccess: (success: IAuthResponse) => {
      toast.success(success.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
      toast.error(message);
    },
  });
  return {
    handleResetPassword,
    isPending,
    handleResetPasswordData,
    isSuccess,
    isError,
  };
}
