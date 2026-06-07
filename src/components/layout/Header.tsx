import { Link, useNavigate } from "react-router-dom";
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
import {
  Heart,
  Youtube,
  HelpCircle,
  Book,
  Gamepad,
  UserSearch,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "You have been signed out." });
    navigate("/");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-brand-primary" />
          <Link to="/" className="flex items-center font-bold text-xl text-brand-primary">
            YouMatterNow
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-primary transition-colors">
            Home
          </Link>
          <Link to="/info" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <Youtube className="h-4 w-4" /> Info
          </Link>
          <Link to="/help" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <HelpCircle className="h-4 w-4" /> Help
          </Link>
          <Link to="/journal" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <Book className="h-4 w-4" /> Journal
          </Link>
          <Link to="/activities" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <Gamepad className="h-4 w-4" /> Activities
          </Link>
          <Link to="/chatbot" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <UserSearch className="h-4 w-4" /> SoulSync
          </Link>
          <Link to="/find-therapist" className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-1">
            <UserSearch className="h-4 w-4" /> Find Therapist
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-brand-primary/30 hover:border-brand-primary transition-colors">
                    <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-semibold text-sm">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
