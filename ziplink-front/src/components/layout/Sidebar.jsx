import { NavLink } from "react-router-dom";
import { LayoutDashboard, Link2, BarChart3, Settings, Inbox, X } from "lucide-react";
import Logo from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Overview", to: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { label: "URLs", to: ROUTES.URLS, icon: Link2 },
  { label: "Analytics", to: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
];

const ADMIN_ITEMS = [
  { label: "Messages", to: ROUTES.MESSAGES, icon: Inbox },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-heading/30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-surface p-5 transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5 text-body" />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-1.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-accent" : "text-body hover:bg-black/5 hover:text-heading"
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
