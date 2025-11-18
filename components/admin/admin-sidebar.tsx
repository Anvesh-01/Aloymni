"use client";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  User,
  Calendar,
  Briefcase,
  Settings,
  LogOut,
  ChevronUp,
  GraduationCap,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
const navigationItems = [
  {
    title: "Dashboard",
    url: "/adminDashboard",
    icon: Home,
  },

  {
    title: "Alumni Directory",
    url: "/adminDashboard/alumni",
    icon: Users,
  },
  {
    title: "Events",
    url: "/adminDashboard/events",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/adminDashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const handleLogout = () => {
    signOut(() => router.push("/"));
  };

  const getUserName = () => {
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress
        .split("@")[0]
        .replace(".", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "User";
  };

  const getUserEmail = () => {
    return user?.emailAddresses?.[0]?.emailAddress || "";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/adminDashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AlumniConnect</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                // Check if current path matches the menu item
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/adminDashboard" &&
                    pathname.startsWith(item.url)) ||
                  (item.url === "/adminDashboard" &&
                    pathname === "/adminDashboard");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {/* The Trigger always wraps the button */}
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        isSignedIn
                          ? user?.imageUrl
                          : "/placeholder.svg?height=32&width=32"
                      }
                      alt={isSignedIn ? getUserName() : "Guest"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {isSignedIn
                        ? getUserName()
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {/* Conditionally show name or 'Guest' */}
                      {isSignedIn ? getUserName() : "Guest"}
                    </span>
                    <span className="truncate text-xs">
                      {isSignedIn ? getUserEmail() : "Please sign in"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/* The Content is always rendered, but its children are conditional */}
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                {isSignedIn ? (
                  // User is signed IN
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/adminDashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/adminDashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  // User is signed OUT
                  <SignInButton mode="modal">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                  </SignInButton>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
