import Link from "next/link";
import {
  Bell,
  Envelope,
  Gear,
  House,
  LayoutSideContentLeft,
  Magnifier,
  Person,
  Star,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";

const recruiterNavItems = [
  { icon: House, label: "Home", href: "/dashboard/recruiter" },
  { icon: Magnifier, label: "Jobs", href: "/dashboard/recruiter/jobs" },
  { icon: Bell, label: "Create a job", href: "/dashboard/recruiter/jobs/new" },
  // { icon: Envelope, label: "Messages", href: "#" },
  { icon: Person, label: "Company Profile", href: "/dashboard/recruiter/company" },
  { icon: Bell, label: "Billing", href: "/dashboard/recruiter/billing" },
  { icon: Gear, label: "Settings", href: "/dashboard/recruiter/settings" },
];

const seekerNavItems = [
  { icon: Magnifier, label: "Jobs", href: "/dashboard/seeker/jobs" },
  { icon: Star, label: "Saved Jobs", href: "/dashboard/seeker/saved-jobs" },
  { icon: Person, label: "Applications", href: "/dashboard/seeker/applications" },
  { icon: Bell, label: "Billing", href: "/dashboard/seeker/billing" },
  { icon: Gear, label: "Settings", href: "/dashboard/seeker/settings" },
];

export default function DashboardSidebar({ role = "recruiter" }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        <SidebarLinks role={role} />
      </aside>

      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
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
                <SidebarLinks role={role} />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}

function SidebarLinks({ role }) {
  const navItems = role === "seeker" ? seekerNavItems : recruiterNavItems;

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
            href={item.href}
          >
            <Icon className="size-5 text-muted" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
