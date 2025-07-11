export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  is_active: boolean;
  date_joined: string | Date; // ISO 8601 date string
  date_birth: string | Date; // ISO 8601 date string
}

export interface Birthday {
  user: Pick<User, "id" | "username">;
  date: string | Date;
}
