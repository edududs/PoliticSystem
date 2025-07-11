export type SidebarItem = {
  label: string;
  icon: string; // Lucide icon name
  href: string;
  roles?: string[];
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    label: "Usuários",
    icon: "Users",
    href: "/users",
    roles: ["admin"],
  },
  {
    label: "Políticos",
    icon: "UserCheck",
    href: "/politicians",
    roles: ["admin", "assessor"],
  },
  {
    label: "Notificações",
    icon: "Bell",
    href: "/notifications",
  },
];
