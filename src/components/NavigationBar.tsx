import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../assets/bread.svg";
import { UserAuth } from '../context/AuthContext';

function NavigationBar() {
  const { signOut, session } = UserAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = session?.user.id;
  const isAdmin = userId === import.meta.env.VITE_ADMIN_USER_ID;

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button
          onClick={() => handleNav("/")}
          className="flex items-center space-x-2 rtl:space-x-reverse"
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

        {/* Desktop nav links */}
        <div className="hidden md:block">
          <ul className="font-medium flex flex-row space-x-8">
            <li>
              <button
                onClick={() => handleNav("/")}
                className="text-primary-foreground hover:opacity-80"
              >
                Hjem
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav("/oppskrifter")}
                className="text-primary-foreground hover:opacity-80"
              >
                Oppskrifter
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  onClick={() => handleNav("/admin/")}
                  className="text-primary-foreground hover:opacity-80"
                >
                  Admin Panel
                </button>
              </li>
            )}
            <li>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="text-primary-foreground hover:opacity-80"
                >
                  Logg ut
                </button>
              ) : (
                <button
                  onClick={() => handleNav("/signin")}
                  className="text-primary-foreground hover:opacity-80"
                >
                  Logg inn
                </button>
              )}
            </li>
          </ul>
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
