export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string; // ISO 8601 date string
}

export interface Birthday {
  user: Pick<User, "id" | "username">;
  date: string;
}
