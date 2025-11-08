import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  LayoutDashboard,
  ListPlus,
  Megaphone,
  LogOut,
  DraftingCompass,
  BadgeQuestionMark,
  PanelLeftClose,
  CircleFadingPlus,
  Menu,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInput,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { NavLink } from "react-router-dom";
import Logo from "../assets/gmblogo.JPG";
import TotalBooking from "../components/TotalBooking";
import { useEffect, useState } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/admin/",
    icon: LayoutDashboard,
  },
  {
    title: "Properties",
    url: "admin/addproperties/",
    icon: ListPlus,
  },
  {
    title: "Booking",
    url: "#",
    icon: ListPlus,
  },
  {
    title: "Customers",
    url: "#",
    icon: Users,
  },
  {
    title: "Marketing",
    url: "#",
    icon: Megaphone,
  },
  {
    title: "Reports",
    url: "#",
    icon: Search,
  },
  {
    title: "Tools",
    url: "#",
    icon: DraftingCompass,
  },
];

const lowerItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Help",
    url: "#",
    icon: BadgeQuestionMark,
  },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("admins")
        .select("first_name, last_name, user_img")
        .eq("user_id", user.id)
        .single();

      if (error) console.error(error);
      setProfile(data);
    };
    if (user?.id) fetchProfile();
  }, [user]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="h-[45px] w-auto mt-[2.5vh] flex justify-between items-center">
              <div className="flex gap-x-3 items-center">
                {" "}
                <div className="h-[40px] w-[40px] p-2 rounded-md">
                  <img
                    src={Logo}
                    className="w-full h-full objet-over rounded-sm"
                  />
                </div>
                <h2 className="text-xl font-bold text-white">GMB LUX</h2>
              </div>
              <SidebarTrigger className="!text-white/80">
                <SidebarMenuButton>
                  <PanelLeftClose color="white" size={18} />
                </SidebarMenuButton>
              </SidebarTrigger>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <div className="relative my-3 ">
                <Search
                  className="absolute top-5 right-2 transform -translate-y-2/3"
                  size={18}
                  color="white"
                />
                <SidebarInput className="pr-8" />
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarGroupContent>
              <SidebarMenu>
                {lowerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem key="Logout">
                  <SidebarMenuButton asChild>
                    <NavLink onClick={handleLogout}>
                      <LogOut />
                      <span>Logout</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            <div className="h-[1px] w-full bg-white/10"></div>
            <div className="flex gap-2 py-2">
              <div className="h-[35px] w-[35px]">
                <img
                  src={profile?.user_img}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <h3 className="text-xs text-white">{user.email}</h3>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        {/* Main content */}
        <main className="w-full min-h-[150vh] lg:p-6 bg-[#121420]">
          <div className="lg:hidden flex justify-between px-[5%]">
            <div></div>
            <SidebarTrigger mobile={true} className="!text-white/80 my-5" />
          </div>{" "}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
