import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiError, ApiResponse } from "@/types/api";
import { IAuthResponse, ILoginForm } from "@/types/auth";
import { User } from "@/types/users";

export const useEmailMutation = () => {
  const queryClient = useQueryClient();
  const { setUserData } = useUserStore();

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
    onSuccess: async (success: IAuthResponse) => {
      toast.success(success.message);

      try {
        const { data: userResponse } =
          await api.get<ApiResponse<User>>("/auth/users/me");

        if (userResponse.data) {
          setUserData(userResponse.data);

          queryClient.setQueryData(["user"], userResponse);
        }
      } catch (error) {
        console.error("Failed to fetch user data after login", error);
        useUserStore.getState().resetUserData();
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login.";
      toast.error(message);
    },
  });

  return { handleLoginEmail, isPending, handleLoginData, isSuccess };
};
