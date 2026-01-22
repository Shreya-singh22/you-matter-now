
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-brand-primary" />
          <p>© 2025 YouMatterNow. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-brand-primary transition-colors">
            About
          </Link>
          <Link to="/privacy" className="hover:text-brand-primary transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-brand-primary transition-colors">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-brand-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
