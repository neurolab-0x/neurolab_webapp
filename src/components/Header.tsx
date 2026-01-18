import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Menu, X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 backdrop-blur-md bg-background/90 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-7 h-7 text-neural-blue" />
          <span className="font-bold text-lg md:text-xl">
            Neur<span className="text-neural-teal">Ai</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/analysis" className="text-foreground/80 hover:text-foreground transition-colors">
            Analysis
          </Link>
          <Link to="/history" className="text-foreground/80 hover:text-foreground transition-colors">
            History
          </Link>
          <Link to="/settings" className="text-foreground/80 hover:text-foreground transition-colors">
            Settings
          </Link>
          <Link to="/private" className="text-foreground/80 hover:text-foreground transition-colors">
            Private
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button variant="outline" size="sm" className="hidden md:flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button className="hidden md:flex">Upload EEG Data</Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 py-3 border-t border-border">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="block py-2 text-foreground/80 hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/analysis" className="block py-2 text-foreground/80 hover:text-foreground">
                Analysis
              </Link>
            </li>
            <li>
              <Link to="/history" className="block py-2 text-foreground/80 hover:text-foreground">
                History
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block py-2 text-foreground/80 hover:text-foreground">
                Settings
              </Link>
            </li>
            <li>
              <Link to="/private" className="block py-2 text-foreground/80 hover:text-foreground">
                Private
              </Link>
            </li>
            <li className="pt-2">
              <Button className="w-full">Upload EEG Data</Button>
            </li>
            <li className="pt-1">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;