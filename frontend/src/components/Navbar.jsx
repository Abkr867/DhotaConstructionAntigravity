import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Project Gallery", path: "/gallery" },
    { name: "Share Your Experience", path: "/reviews" },
    { name: "Cost Estimator", path: "/estimator" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-[#0B2035]/95 backdrop-blur-sm border-b border-[#142E4F]"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2"
            data-testid="navbar-logo"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_construct-dhota/artifacts/u7scmm47_WhatsApp%20Image%202025-12-25%20at%2019.24.16.jpeg" 
              alt="Dhota Construction Logo" 
              width="40"
              height="40"
              decoding="async"
              className="w-10 h-10 object-contain rounded"
            />
            <span className="text-white text-sm md:text-base font-bold tracking-tight whitespace-nowrap" style={{ fontFamily: 'Oswald, sans-serif' }}>
              DHOTA CONSTRUCTION<span className="text-[#D69A55]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? "text-[#D69A55]"
                    : "text-gray-300 hover:text-white"
                }`}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="tel:+919110986889" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              data-testid="navbar-phone"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 91109 86889</span>
            </a>
            <a 
              href="https://wa.me/919110986889?text=Hello!%20I'm%20interested%20in%20your%20construction%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-green-500 hover:bg-green-600 flex items-center justify-center rounded-full transition-colors"
              title="Chat on WhatsApp"
              data-testid="navbar-whatsapp"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <Link to="/estimator">
              <Button 
                className="bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none px-6 font-semibold uppercase text-sm tracking-wider"
                data-testid="navbar-cta"
              >
                Get Estimate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-2"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="lg:hidden border-t border-gray-800 py-4"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-[#D69A55] bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t border-gray-800 mt-2">
                <div className="flex items-center gap-3 mb-4">
                  <a 
                    href="tel:+919110986889" 
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91 91109 86889</span>
                  </a>
                  <a 
                    href="https://wa.me/919110986889?text=Hello!%20I'm%20interested%20in%20your%20construction%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
                <Link to="/estimator" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none font-semibold uppercase text-sm tracking-wider"
                  >
                    Get Estimate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
