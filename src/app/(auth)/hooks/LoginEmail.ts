import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError, ApiResponse } from "@/types/api";
import { IAuthResponse, ILoginForm } from "@/types/email";

const url =
  process.env.NEXT_PUBLIC_RUN_MODE === "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV + `auth/local/email`
    : process.env.NEXT_PUBLIC_API_URL_PROD + `auth/email`;

export const useEmailMutation = () => {
  const {
    mutateAsync: handleLoginEmail,
    isPending,
    data: handleLoginData,
  } = useMutation<
    AxiosResponse<ApiResponse<IAuthResponse>>,
    AxiosError<ApiError>,
    ILoginForm
  >({
    mutationFn: async (data: ILoginForm) => {
      const res = await axios.post<ApiResponse<IAuthResponse>>(url, data);

      return res;
    },
  });
  return { handleLoginEmail, isPending, handleLoginData };
};
