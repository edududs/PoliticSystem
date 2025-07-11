"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";

interface LogoutResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

async function logout(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout");
  return response.data;
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LogoutResponse, AxiosError<ErrorResponse>, void>({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data.message || "Logout realizado com sucesso!");

      queryClient.clear();

      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        "Ocorreu um erro no logout. Tente novamente mais tarde.";
      toast.error(errorMessage);

      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
