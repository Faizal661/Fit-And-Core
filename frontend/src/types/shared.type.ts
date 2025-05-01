import { LucideIcon } from "lucide-react";

export interface SidebarProps {
  role: "user" | "trainer" | "admin" | undefined;
  username: string | undefined;
  onClose: () => void;
  onLogout: () => void;
}

export interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}