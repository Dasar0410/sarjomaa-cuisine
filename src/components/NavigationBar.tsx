import { useNavigate } from "react-router-dom";
import Logo from "../assets/bread.svg";
import { UserAuth } from '../context/AuthContext';

function NavigationBar() {
  const { signOut, session } = UserAuth();
  const navigate = useNavigate();
  const userId = session?.user.id;
  const isAdmin = userId === import.meta.env.VITE_ADMIN_USER_ID;

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/"); // Redirect to home after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <img src={Logo} className="h-9" alt="Sarjomaa Cuisine Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Sarjomaa-Cuisine
          </span>
        </button>
        <div className="hidden w-full md:block md:w-auto text-brand" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-border rounded-lg bg-background md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-primary dark:bg-background md:dark:bg-primary">
            <li>
              <button
                onClick={() => navigate("/")}
                className="block py-2 px-3 rounded md:bg-transparent hover:opacity-80 md:text-primary-foreground md:p-0"
              >
                Hjem
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/recipes")}
                className="block py-2 px-3 rounded text-primary-foreground hover:opacity-80 md:bg-transparent md:p-0"
              >
                Oppskrifter
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  onClick={() => navigate("/admin/")}
                  className="block py-2 px-3 rounded text-primary-foreground hover:opacity-80 md:bg-transparent md:p-0"
                >
                  Admin Panel
                </button>
              </li>
            )}
            <li>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="block py-2 px-3 rounded text-primary-foreground hover:opacity-80 bg-transparent border-none cursor-pointer font-medium md:p-0"
                >
                  Logg ut
                </button>
              ) : (
                <button
                  onClick={() => navigate("/signin")}
                  className="block py-2 px-3 rounded text-primary-foreground hover:opacity-80 md:bg-transparent md:p-0"
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