import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import Dropdown from "../ui/Dropdown";
import PageTransition from "../common/PageTransition";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate=useNavigate();
  const{logout,user}=useAuth();

  const handleLogout= async () => {
    try{
      await logout();
      navigate(ROUTES.LOGIN, {replace:true});
    } catch(error){
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-5 py-4 backdrop-blur-sm sm:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5.5 w-5.5 text-heading" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Dropdown
              align="right"
              trigger={
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ??
                    user?.username?.charAt(0)?.toUpperCase() ??
                    user?.email?.charAt(0)?.toUpperCase() ??
                    "U"
                  }
                </button>
              }
              items={[
                { 
                  label: "Profile", 
                  icon: User, 
                  onClick: () =>navigate(ROUTES.SETTINGS),
                },
                { label: "Settings",
                  icon: SettingsIcon,
                  onClick: () => navigate(ROUTES.SETTINGS),
                },
                { label: "Log out", 
                  icon: LogOut, 
                  onClick: handleLogout, 
                  danger: true },
              ]}
            />
          </div>
        </header>
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
