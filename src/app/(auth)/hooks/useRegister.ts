import api from "@/lib/api"; // pastikan path ini benar
import { IAuthResponse, IRegisterData } from "@/types/auth";
// src/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export function useRegister() {
  const {
    mutate: handleRegister,
    isPending,
    data: handleRegisterData,
    isSuccess,
    isError,
  } = useMutation<IAuthResponse, AxiosError<ApiError>, IRegisterData>({
    mutationFn: async (data: IRegisterData) => {
      const res = await api.post("/auth/register", data);
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
  return { handleRegister, isPending, handleRegisterData, isSuccess, isError };
}
