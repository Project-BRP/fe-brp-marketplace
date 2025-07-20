import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { IUpdateUserResponse, IUpdateUserData } from "@/types/auth";
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
      console.log(data);
      const res = await api.patch("/auth/users/me", data);
      return res.data;
    },
    onSuccess: (success: IUpdateUserResponse) => {
      toast.success(success.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.log(error);
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
