import api from "@/lib/api";
import { IAuthResponse, IForgotPasswordForm } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export function useForgotPasswordMutation() {
  const {
    mutate: handleForgotPassword,
    isPending,
    data: handleForgotPasswordData,
    isSuccess,
    isError,
  } = useMutation<IAuthResponse, AxiosError<ApiError>, IForgotPasswordForm>({
    mutationFn: async (data: IForgotPasswordForm) => {
      const res = await api.post("/auth/forgot-password", data);
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
    handleForgotPassword,
    isPending,
    handleForgotPasswordData,
    isSuccess,
    isError,
  };
}
