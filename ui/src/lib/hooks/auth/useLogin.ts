"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";
import type { LoginFormSchema } from "@/lib/schemas/auth.schema";

interface LoginResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

async function login(data: LoginFormSchema): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginFormSchema>(
    {
      mutationFn: login,
      onSuccess: (data) => {
        toast.success(data.message || "Login realizado com sucesso!");

        queryClient.invalidateQueries({ queryKey: ["me"] });

        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Ocorreu um erro. Tente novamente mais tarde.";
        toast.error(errorMessage);
      },
    }
  );
}
