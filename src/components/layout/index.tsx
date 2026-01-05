import { useMemo, useState } from "react";
import type { INavItem } from "./type";
import { Navigate, useLocation } from "react-router";
import {
  ChartStackedIcon,
  ChartVerticalFilledIcon,
  ClockIcon,
  DiscountIcon,
  OrderIcon,
  PackageIcon,
  SettingsIcon,
  StoreIcon,
} from "@shopify/polaris-icons";
import Sidebar from "./sidebar";
import TopBar from "./topbar";
import useAuth from "../../hooks/use-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: DashboardLayoutProps) => {
  const isLoggedIn = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems: INavItem[] = useMemo(() => {
    return [
      { name: "Dashboard", url: "/", icon: ChartVerticalFilledIcon },
      { name: "Stores", url: "/stores", icon: PackageIcon },
      { name: "Subscribers", url: "/subscribers", icon: StoreIcon },
      { name: "Campaigns", url: "/campaigns", icon: DiscountIcon },
      {
        name: "Announcement Bar",
        url: "/announce-bar",
        icon: ChartStackedIcon,
      },
      {
        name: "Timer For Products",
        url: "/timer-for-products",
        icon: ClockIcon,
      },
      {
        name: "Settings",
        url: "/settings",
        icon: SettingsIcon,
        // hasDropdown: true,
      },
      { name: "Integrations", url: "/integrations", icon: OrderIcon },
      {
        name: "Activity Log",
        url: "/activity-logs",
        icon: OrderIcon,
      },
      {
        name: "Review Log",
        url: "/review",
        icon: OrderIcon,
      },
    ].map((item) => {
      const isClaimsRoute = /^\/stores\/[^/]+$/.test(location.pathname);
      return {
        ...item,
        active:
          item.url === location.pathname ||
          (item.name === "stores" && isClaimsRoute),
      };
    });
  }, [location.pathname]);
  const activeNavItem = navItems.find((item) => item.active);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        navItems={navItems}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          onMenuButtonClick={() => setSidebarOpen(true)}
          open={sidebarOpen}
          activeNavItem={activeNavItem}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
