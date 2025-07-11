import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Usuário é obrigatório" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
