import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Youtube, HelpCircle, Book, Gamepad, UserSearch } from "lucide-react";

export function Header() {
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
        <div className="flex items-center gap-4">
          {localStorage.getItem("token") ? (
            <Link to="/profile">
              <Button size="sm" variant="ghost" className="flex items-center gap-2">
                <UserSearch className="h-4 w-4" /> Profile
              </Button>
            </Link>
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
