import api from "@/lib/api";
import { IUpdateUserData, IUpdateUserResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const {
    mutateAsync: updateUserProfile,
    data: handleUpdateUserData,
    isPending: isUpdating,
    isSuccess,
    isError,
  } = useMutation<
    IUpdateUserResponse,
    AxiosError<ApiError>,
    IUpdateUserData | FormData
  >({
    mutationFn: async (data: IUpdateUserData | FormData) => {
      const res = await api.patch("/auth/users/me", data);
      return res.data;
    },
    onSuccess: (success: IUpdateUserResponse) => {
      toast.success(success.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
      toast.error(message);
    },
  });

  return {
    updateUserProfile,
    handleUpdateUserData,
    isUpdating,
    isSuccess,
    isError,
  };
}
