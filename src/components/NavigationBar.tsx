import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/bread.svg";
import { UserAuth } from '../context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

function NavigationBar() {
  const { signOut, session } = UserAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = session?.user.id;
  const isAdmin = userId === import.meta.env.VITE_ADMIN_USER_ID;

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const linkClass = cn(
    navigationMenuTriggerStyle(),
    "bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground text-lg rounded-none h-full px-5 py-0"
  );

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-stretch justify-between mx-auto px-4">
        <button
          onClick={() => handleNav("/")}
          className="flex items-center space-x-2 rtl:space-x-reverse py-4"
        >
          <img src={Logo} className="h-10" alt="SarjoMat Logo" />
          <span className="self-center text-3xl whitespace-nowrap tracking-tight">
            <span className="font-light">Sarjo</span><span className="font-bold">Mat</span>
          </span>
        </button>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex self-stretch cursor-pointer">
          <NavigationMenu className="h-full items-stretch">
            <NavigationMenuList className="h-full items-stretch space-x-0">
              <NavigationMenuItem className="h-full">
                <NavigationMenuLink className={linkClass} onClick={() => handleNav("/")}>
                  Hjem
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="h-full">
                <NavigationMenuLink className={linkClass} onClick={() => handleNav("/oppskrifter")}>
                  Oppskrifter
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isAdmin && (
                <NavigationMenuItem className="h-full">
                  <NavigationMenuLink className={linkClass} onClick={() => handleNav("/admin/")}>
                    Admin Panel
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem className="h-full">
                {session ? (
                  <NavigationMenuLink className={linkClass} onClick={handleSignOut}>
                    Logg ut
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink className={linkClass} onClick={() => handleNav("/signin")}>
                    Logg inn
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>


      {/* Mobile nav menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/20">
          <ul className="flex flex-col px-4 py-2">
            <li>
              <button
                onClick={() => handleNav("/")}
                className="block w-full text-left py-3 px-2 text-primary-foreground hover:opacity-80"
              >
                Hjem
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav("/oppskrifter")}
                className="block w-full text-left py-3 px-2 text-primary-foreground hover:opacity-80"
              >
                Oppskrifter
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  onClick={() => handleNav("/admin/")}
                  className="block w-full text-left py-3 px-2 text-primary-foreground hover:opacity-80"
                >
                  Admin Panel
                </button>
              </li>
            )}
            <li>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-3 px-2 text-primary-foreground hover:opacity-80"
                >
                  Logg ut
                </button>
              ) : (
                <button
                  onClick={() => handleNav("/signin")}
                  className="block w-full text-left py-3 px-2 text-primary-foreground hover:opacity-80"
                >
                  Logg inn
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
