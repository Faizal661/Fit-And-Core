import {
  Home,
  User,
  Users,
  Globe,
  TrendingUp,
  Utensils,
  Calendar,
  FileText,
  Dumbbell,
  DollarSign,
  BarChart,
  MessageSquare,
} from "lucide-react";
import { SIDEBAR_MESSAGES } from "../../constants/messages/sidebar.messages";

export const UserSidebarItems = [
  { to: "/", label: SIDEBAR_MESSAGES.HOME, icon: Home },
  { to: "/profile", label: SIDEBAR_MESSAGES.PROFILE, icon: User },
  { to: "/articles", label: SIDEBAR_MESSAGES.ARTICLES, icon: FileText },
  { to: "/trainers", label: SIDEBAR_MESSAGES.TRAINERS, icon: Users },
  { to: "/progress", label: SIDEBAR_MESSAGES.PROGRESSION, icon: TrendingUp },
  { to: "/nutrition", label: SIDEBAR_MESSAGES.NUTRITION, icon: Utensils },
  { to: "/communities", label: SIDEBAR_MESSAGES.COMMUNITIES, icon: Globe },
  { to: "/messages", label: SIDEBAR_MESSAGES.MESSAGES, icon: MessageSquare },
  { to: "/reports", label: SIDEBAR_MESSAGES.REPORTS, icon: BarChart },
  {
    to: "/wallet",
    label: SIDEBAR_MESSAGES.Wallet,
    icon: DollarSign,
  },
];

export const TrainerSidebarItems = [
  { to: "/trainer", label: SIDEBAR_MESSAGES.DASHBOARD, icon: Home },
  {
    to: "/trainer/trainees-management",
    label: SIDEBAR_MESSAGES.TRAINEE_MANAGEMENT,
    icon: Users,
  },
  {
    to: "/trainer/articles",
    label: SIDEBAR_MESSAGES.ARTICLE_MANAGEMENT,
    icon: FileText,
  },
  {
    to: "/trainer/availability-setup",
    label: SIDEBAR_MESSAGES.SESSION_MANAGEMENT,
    icon: Calendar,
  },
  {
    to: "/trainer/sessions",
    label: SIDEBAR_MESSAGES.UPCOMING_SESSIONS,
    icon: Calendar,
  },
  {
    to: "/trainer/finance",
    label: SIDEBAR_MESSAGES.FINANCE_MANAGEMENT,
    icon: TrendingUp,
  },
  { to: "/messages", label: SIDEBAR_MESSAGES.MESSAGES, icon: MessageSquare },
  { to: "/trainer/reports", label: SIDEBAR_MESSAGES.REPORTS, icon: BarChart },
];

export const AdminSidebarItems = [
  { to: "/admin", label: SIDEBAR_MESSAGES.DASHBOARD, icon: BarChart },
  {
    to: "/admin/user-management",
    label: SIDEBAR_MESSAGES.USER_MANAGEMENT,
    icon: Users,
  },
  {
    to: "/admin/trainer-management",
    label: SIDEBAR_MESSAGES.TRAINER_MANAGEMENT,
    icon: Dumbbell,
  },
  {
    to: "/admin/finance-management",
    label: SIDEBAR_MESSAGES.FINANCE_MANAGEMENT,
    icon: DollarSign,
  },
  {
    to: "/admin/report-management",
    label: SIDEBAR_MESSAGES.REPORT_MANAGEMENT,
    icon: BarChart,
  },
  {
    to: "/admin/community-management",
    label: SIDEBAR_MESSAGES.COMMUNITY_MANAGEMENT,
    icon: Globe,
  },
];

export const QuickActions = {
  user: [
    // { label: SIDEBAR_MESSAGES.CREDITS, icon: Award },
    // {
    //   to: "/upcoming-bookings",
    //   label: SIDEBAR_MESSAGES.BOOKINGS,
    //   icon: Calendar,
    // },
    { to: "/streak", label: `${SIDEBAR_MESSAGES.STREAK}`, icon: TrendingUp },
  ],
};
