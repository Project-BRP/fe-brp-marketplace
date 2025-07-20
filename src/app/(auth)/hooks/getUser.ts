import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export default function getUser() {
  const {
    data: getUserData,
    isLoading,
    isError,
    error,
    isPending,
    refetch,
  } = useQuery<ApiResponse<User>, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>("/auth/users/me");
      return response.data;
    },
    enabled: false,
  });
  return { getUserData, isLoading, isError, error, refetch, isPending };
}
