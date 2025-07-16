import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError, ApiResponse } from "@/types/api";

interface EmailFormRequest {
  email: string;
  password: string;
}

interface EmailFormResponse {
  resultCode: number;
  resultMessage: string;
}

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
    AxiosResponse<ApiResponse<EmailFormResponse>>,
    AxiosError<ApiError>,
    EmailFormRequest
  >({
    mutationFn: async (data: EmailFormRequest) => {
      const res = await axios.post<ApiResponse<EmailFormResponse>>(url, data);

      return res;
    },
  });
  return { handleLoginEmail, isPending, handleLoginData };
};
