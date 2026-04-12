import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  const { pathname } = useLocation();
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
    if (path === '/signin') {
      sessionStorage.setItem('redirectAfterLogin', pathname);
    }
    navigate(path);
    setMenuOpen(false);
  };

  const linkClass = (path: string) => cn(
    navigationMenuTriggerStyle(),
    "bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground focus:bg-primary-foreground/10 focus:text-primary-foreground text-lg rounded-none h-full px-5 py-0 border-b-2 border-transparent",
    pathname === path && "border-primary-foreground"
  );

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-stretch justify-between mx-auto px-4">
        <button
          onClick={() => handleNav("/")}
          className="flex space-x-1  py-4"
        >
          <svg className="h-10 w-10" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M7.00009 20V9C7.00009 9 3.00004 4 9.50009 4H17.0001C24.0002 4 20.0001 9 20.0001 9V18C20.0001 19.1046 19.1047 20 18.0001 20H7.00009Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.00009 20H6.00009C4.89552 20 4.00009 19.1046 4.00009 18V9C4.00009 9 4.00543e-05 4 6.50009 4H10.0001" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
                <NavigationMenuLink className={linkClass("/")} onClick={() => handleNav("/")}>
                  Hjem
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="h-full">
                <NavigationMenuLink className={linkClass("/oppskrifter")} onClick={() => handleNav("/oppskrifter")}>
                  Oppskrifter
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isAdmin && (
                <NavigationMenuItem className="h-full">
                  <NavigationMenuLink className={linkClass("/admin/")} onClick={() => handleNav("/admin/")}>
                    Admin Panel
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem className="h-full">
                {session ? (
                  <NavigationMenuLink className={linkClass("/signout")} onClick={handleSignOut}>
                    Logg ut
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink className={linkClass("/signin")} onClick={() => handleNav("/signin")}>
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
