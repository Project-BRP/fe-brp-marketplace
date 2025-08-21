import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiError } from "@/types/api";
import { IAuthResponse } from "@/types/auth";

export function useLogout() {
  const { resetUserData } = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isLoggingOut } = useMutation<
    IAuthResponse,
    AxiosError<ApiError>
  >({
    mutationFn: async () => {
      const res = await api.post("/auth/logout", {}, { withCredentials: true });
      return res.data;
    },
  });

  const handleLogout = async () => {
    try {
      const success = await mutateAsync();
      toast.success(success.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ||
        "An error occurred during logout.";
      toast.error(message);
    } finally {
      resetUserData();
      queryClient.invalidateQueries({
        refetchType: "none",
      });
      router.push("/sign-in");
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}
