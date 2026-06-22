// menu.js (or wherever you define your menu)
import { LayoutDashboard, Users, Plug, List, User,  NotebookPen, ClipboardCheck, MessageCircle, Handshake, HandCoins, UserStar } from "lucide-react";

export const menu = {
  admin: [
    { name: "Admin Dashboard", path: "admin-dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Manage users", path: "manage-users", icon: <Users size={18} /> },
    { name: "Property list", path: "property-list", icon: <NotebookPen size={18} /> },
    { name: "My conversations", path: "my-conversations", icon: <MessageCircle  size={18} /> },
    { name: "Transactions", path: "transactions", icon: <HandCoins  size={18} /> },
    { name: "Agent list", path: "agent-list", icon: <UserStar   size={18} /> },
    // { name: "Connect api", path: "connect-api", icon: <Plug size={18} /> },
    // { name: "Api list", path: "api-list", icon: <List size={18} /> },
  ],

  agent: [
    { name: "Agent dashboard", path: "agent-dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Assigned properties", path: "assigned-properties", icon: <ClipboardCheck  size={18} /> },
    { name: "Conversations", path: "conversations", icon: <MessageCircle  size={18} /> },
    { name: "Agent deals", path: "agent-deals", icon: <Handshake size={18} /> },
    { name: "Agent transactions", path: "agent-transactions", icon: <HandCoins   size={18} /> },
   
  ],

  user: [
    { name: "User Dashboard", path: "user-dashboard", icon: <User size={18} /> },
    { name: "My conversations", path: "my-conversations", icon: <MessageCircle  size={18} /> },
    { name: "My deals", path: "my-deals", icon: <Handshake size={18} /> },
    { name: "My transactions", path: "my-transactions", icon: <HandCoins   size={18} /> },
  ],
};