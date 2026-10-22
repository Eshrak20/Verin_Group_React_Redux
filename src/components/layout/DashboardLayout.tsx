import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { dashboardRoutes } from "@/data/dashboardRoutes";
import { useAppSelector } from "@/redux/hooks";
import { NavLink, Outlet, useLocation } from "react-router";
import Logo from "/favicon.png";

const DashboardNavigation = () => {
    const location = useLocation();
    const { isMobile, setOpenMobile, state } = useSidebar();
    const user = useAppSelector((state) => state.auth.user);
    const companyName = "Verin Group";

    const closeMobileSidebar = () => {
        if (isMobile) setOpenMobile(false);
    };

     const navigationItems = dashboardRoutes.map((route) => ({
    ...route,
    isActive: location.pathname === route.to,
  }));

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader
                className={`h-14 shrink-0 flex-row items-center border-b px-4 py-0 ${state === "collapsed" && !isMobile ? "justify-center px-0" : ""
                    }`}
            >
                <NavLink
                    to="/"
                    onClick={closeMobileSidebar}
                    className={`flex min-w-0 items-center gap-3 overflow-hidden ${state === "collapsed" && !isMobile ? "justify-center" : ""
                        }`}
                >
                    <img
                        src={Logo}
                        alt={`${companyName} Logo`}
                        className="size-9 shrink-0 rounded-xl bg-white p-1 object-contain"
                        onError={(event) => {
                            event.currentTarget.src = Logo;
                        }}
                    />
                    {(state === "expanded" || isMobile) && (
                        <span className="truncate text-base font-semibold text-sidebar-foreground">
                            {companyName}
                        </span>
                    )}
                </NavLink>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map(({ label, to, icon: Icon, isActive }) => (
                                <SidebarMenuItem key={to}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={label}
                                    >
                                        <NavLink to={to} onClick={closeMobileSidebar}>
                                            <Icon />
                                            <span>{label}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3">
                {user && (
                    <div className="min-w-0 rounded-lg bg-sidebar-accent px-3 py-2">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
};

const DashboardLayout = () => {
    const location = useLocation();
    const pageTitle =
        location.pathname === "/dashboard/my-profile" ? "My profile" : "Dashboard";

    return (
        <TooltipProvider>
            <SidebarProvider>
                <DashboardNavigation />
                <DashboardContent pageTitle={pageTitle} />
            </SidebarProvider>
        </TooltipProvider>
    );
};

const DashboardContent = ({ pageTitle }: { pageTitle: string }) => {
    const { isMobile, state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <SidebarInset>
            <header
                className={`relative flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 ${isMobile
                    ? ""
                    : isCollapsed
                        ? "pl-4"
                        : "pl-7"
                    }`}
            >
                <SidebarTrigger
                    className={
                        isMobile
                            ? "shrink-0"
                            : "absolute left-0 top-1/2 z-20 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card shadow-sm hover:bg-muted"
                    }
                />
                {isMobile && <div className="h-5 w-px bg-border" />}
                <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </SidebarInset>
    );
};

export default DashboardLayout;
