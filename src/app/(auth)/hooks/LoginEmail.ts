import api from "@/lib/api";
import { ApiError } from "@/types/api";
import { IAuthResponse, ILoginForm } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useEmailMutation = () => {
  const {
    mutateAsync: handleLoginEmail,
    isPending,
    data: handleLoginData,
    isSuccess,
  } = useMutation<IAuthResponse, AxiosError<ApiError>, ILoginForm>({
    mutationFn: async (data: ILoginForm) => {
      const res = await api.post<IAuthResponse>(`/auth/login`, data);
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
  return { handleLoginEmail, isPending, handleLoginData, isSuccess };
};
