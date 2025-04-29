
import { ReactNode, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Settings,
  TicketCheck,
  Users,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      path: "/dashboard",
      roles: [UserRole.CLIENT, UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      title: "Meus Chamados",
      icon: <TicketCheck size={20} />,
      path: "/tickets",
      roles: [UserRole.CLIENT, UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      title: "Gerenciar Usuários",
      icon: <Users size={20} />,
      path: "/users",
      roles: [UserRole.ADMIN],
    },
    {
      title: "Clientes",
      icon: <UserPlus size={20} />,
      path: "/clients",
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      title: "Configurações",
      icon: <Settings size={20} />,
      path: "/settings",
      roles: [UserRole.CLIENT, UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.MANAGER],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col bg-white border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1
            className={cn(
              "font-bold text-primary transition-opacity duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            AjudaTech Hub
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary",
                location.pathname === item.path && "bg-primary/10 text-primary font-medium"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span
                className={cn(
                  "transition-opacity duration-300",
                  collapsed ? "opacity-0 hidden" : "opacity-100"
                )}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div
            className={cn(
              "flex items-center space-x-3",
              collapsed && "justify-center"
            )}
          >
            <Avatar>
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "transition-opacity duration-300",
                collapsed ? "opacity-0 hidden" : "opacity-100"
              )}
            >
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <div className="md:hidden flex items-center h-16 px-4 bg-white border-b">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <h1 className="ml-4 font-bold text-primary">AjudaTech Hub</h1>
        </div>

        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <div className="py-4">
              <h2 className="px-4 text-lg font-bold text-primary">AjudaTech Hub</h2>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary",
                    location.pathname === item.path &&
                      "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div></div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-xs text-muted-foreground capitalize">
                    {user.role}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
