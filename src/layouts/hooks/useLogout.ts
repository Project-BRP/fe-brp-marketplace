import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { removeToken } from "@/lib/cookies";
import useUserStore from "@/store/userStore";
import { ApiError } from "@/types/api";
import { IAuthResponse } from "@/types/auth";

/**
 * Custom hook for handling user logout.
 * It sends a request to the logout endpoint, clears user data from the store and cookies,
 * and redirects the user to the sign-in page.
 */
export function useLogout() {
  const { resetUserData } = useUserStore();
  const router = useRouter();

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation<
    IAuthResponse,
    AxiosError<ApiError>
  >({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: (success) => {
      toast.success(success.message);
      // Clear all user-related data from the client
      resetUserData();
      removeToken();
      // Redirect to sign-in page after successful logout
      router.push("/sign-in");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "An error occurred during logout.";
      toast.error(message);
      // Still attempt to clear client-side data even if API call fails
      resetUserData();
      removeToken();
      router.push("/sign-in");
    },
  });

  return {
    handleLogout,
    isLoggingOut,
  };
}
