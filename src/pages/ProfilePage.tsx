import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Mail,
  LogOut,
  BookOpen,
  Gamepad2,
  MessageCircle,
  UserSearch,
  Smile,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const features = [
  { icon: BookOpen, label: "Journal", desc: "Track your thoughts & feelings", href: "/journal" },
  { icon: Gamepad2, label: "Activities", desc: "Mood-boosting exercises", href: "/activities" },
  { icon: MessageCircle, label: "SoulSync", desc: "AI emotional support chatbot", href: "/chatbot" },
  { icon: UserSearch, label: "Find Therapist", desc: "Connect with professionals", href: "/find-therapist" },
];

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    logout();
    toast({ title: "Signed out", description: "You have been successfully logged out." });
    navigate("/");
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      {/* Profile Hero Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-primary/20 via-brand-primary/10 to-pink-100/30" />
        <CardContent className="relative pb-6 pt-0">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-brand-primary text-white text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge variant="secondary" className="text-brand-primary border-brand-primary/30">
                <Heart className="h-3 w-3 mr-1 fill-brand-primary text-brand-primary" />
                Member
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Smile className="h-4 w-4 text-brand-primary" />
              Taking steps towards better mental health — one day at a time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <h2 className="text-lg font-semibold mb-4 text-foreground">Your Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map(({ icon: Icon, label, desc, href }) => (
          <Card
            key={label}
            className="cursor-pointer hover:border-brand-primary/50 hover:shadow-md transition-all duration-200 group"
            onClick={() => navigate(href)}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
