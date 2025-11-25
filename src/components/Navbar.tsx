import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

export const Navbar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">The Second Chapter</span>
              <span className="text-xs text-muted-foreground">Affordable books, anywhere.</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Browse Books
            </Link>
            <Link to="/donation" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Donation Form
            </Link>
            <Link to="/volunteer-login" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Volunteer Login
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-border bg-card px-4 py-2">
          <div className="flex items-center justify-around">
            <Link to="/" className="text-xs font-medium text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/browse" className="text-xs font-medium text-foreground hover:text-primary transition-smooth">
              Browse
            </Link>
            <Link to="/donation" className="text-xs font-medium text-foreground hover:text-primary transition-smooth">
              Donate
            </Link>
            <Link to="/volunteer-login" className="text-xs font-medium text-foreground hover:text-primary transition-smooth">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
