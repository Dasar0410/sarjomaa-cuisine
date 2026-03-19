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
          <img src={Logo} className="h-9" alt="Sarjomaa Cuisine Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Sarjomaa-Cuisine
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

        {/* Nav links */}
        <div className={`${menuOpen ? "block" : "hidden"} absolute top-full left-0 w-full md:static md:block md:w-auto`}>
          <ul className="font-medium flex flex-col p-4 md:p-0 border border-border md:border-0 bg-background md:bg-primary md:flex-row md:space-x-8">
            <li>
              <button
                onClick={() => handleNav("/")}
                className="block py-2 px-3 w-full text-left text-foreground md:text-primary-foreground hover:opacity-80 md:p-0"
              >
                Hjem
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav("/oppskrifter")}
                className="block py-2 px-3 w-full text-left text-foreground md:text-primary-foreground hover:opacity-80 md:p-0"
              >
                Oppskrifter
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  onClick={() => handleNav("/admin/")}
                  className="block py-2 px-3 w-full text-left text-foreground md:text-primary-foreground hover:opacity-80 md:p-0"
                >
                  Admin Panel
                </button>
              </li>
            )}
            <li>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="block py-2 px-3 w-full text-left text-foreground md:text-primary-foreground hover:opacity-80 md:p-0"
                >
                  Logg ut
                </button>
              ) : (
                <button
                  onClick={() => handleNav("/signin")}
                  className="block py-2 px-3 w-full text-left text-foreground md:text-primary-foreground hover:opacity-80 md:p-0"
                >
                  Logg inn
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
