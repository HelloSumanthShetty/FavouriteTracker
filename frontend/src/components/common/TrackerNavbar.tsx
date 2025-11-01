import {
  NavbarT,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Sun,Moon } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const TrackerNavbar = ({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) => {
   const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];
  const API_URL = import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = API_URL;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); 
  
  const logout = async () => { 
      try {
          const response = await axios.post("/api/users/logout", {}, { withCredentials: true });
          const data = await response.data; 
          if (data.success) {
              localStorage.removeItem("token");
              toast.success(data.msg);
              navigate("/auth");
              window.location.reload(); 
          }  
      } catch (error) {
          console.error("Error:", error);
          toast.error("Something went wrong");
      }
  };

  return (
    <div className="relative w-full">
      <NavbarT>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={() => {setTheme(theme === "dark" ? "light" : "dark"); toast.success(`Switched to ${theme === "dark" ? "Light" : "Dark"} Mode`);}}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </NavbarButton>
            <NavbarButton variant="primary" onClick={logout}>Logout</NavbarButton>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <img src="" alt="" />
              <NavbarButton
                onClick={() =>{ setIsMobileMenuOpen(false); }}
                variant="primary"
                className="w-full"
            
              >
                Logout
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarT>
    </div>
  );
}

export default TrackerNavbar;