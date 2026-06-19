import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CreditCard,
  Settings,
  PanelLeft,
} from "lucide-react";
import { Button, Drawer } from "@heroui/react";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
  { icon: Users, label: "Users", href: "#" },
  { icon: Building2, label: "Companies", href: "/dashboard/admin/companies" },
  { icon: Briefcase, label: "Jobs", href: "#" },
  { icon: CreditCard, label: "Payments", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

export default function AdminSidebar() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        <SidebarLinks />
      </aside>

      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <PanelLeft />
          Sidebar
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <SidebarLinks />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}

function SidebarLinks() {
  return (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/dashboard/admin";

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-default text-foreground"
                : "text-foreground hover:bg-default"
            }`}
          >
            <Icon className="size-5 text-muted shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
