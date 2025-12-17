import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm font-medium transition-colors",
          isActive ? "text-blue-600" : "text-slate-700 hover:text-slate-900",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function TopNavBar() {
  const { token, onLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Left: logo + name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            ♥
          </div>
          <span className="text-xl font-semibold">myHealthClinic</span>
        </Link>


        <nav className="hidden md:flex items-center gap-10">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/appointments">Appointments</NavItem>
          <NavItem to="/doctors">Doctors</NavItem>
        <NavItem to="/patients">Patients</NavItem>
        </nav>

        {/* Right: login button */}
        <div className="flex items-center gap-3">
          {token ? (
            <Button
              variant="outline"
              className="rounded-full shadow-sm"
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-full shadow-sm gap-2"
              onClick={() => navigate("/")}
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
