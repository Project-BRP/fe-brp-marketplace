import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { ApiError } from "@/types/api";
import { IAuthResponse } from "@/types/auth";

export function useLogout() {
  const { resetUserData } = useUserStore();
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
      // Membersihkan data pengguna dari Zustand dan menghapus cookie
      resetUserData();

      // Menghentikan semua query yang sedang berjalan dan membersihkan cache
      queryClient.cancelQueries();
      queryClient.clear();

      // Mengarahkan ke halaman sign-in dan memaksa reload
      window.location.href = "/sign-in";
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}
