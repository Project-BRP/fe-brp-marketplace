import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

// Define the structure of the API response for users
export interface UsersResponse {
  totalPage: number;
  currentPage: number;
  users: User[];
}

// Define the parameters for fetching users
type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string; // Changed from 'status' to 'isActive'
};

// Hook to fetch users with pagination, search, and status filtering
export const useGetUsers = (params: GetUsersParams) => {
  return useQuery<ApiResponse<UsersResponse>, Error>({
    queryKey: ["users", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));
      if (params.search) queryParams.set("search", params.search);
      if (params.isActive && params.isActive !== "Semua") {
        queryParams.set(
          "isActive",
          String(params.isActive === "Aktif").toString(),
        );
      }

      const res = await api.get(`/auth/users?${queryParams.toString()}`);
      return res.data;
    },
  });
};
