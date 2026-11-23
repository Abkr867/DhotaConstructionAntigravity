import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B2035] text-gray-300" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_construct-dhota/artifacts/u7scmm47_WhatsApp%20Image%202025-12-25%20at%2019.24.16.jpeg" 
                alt="Dhota Construction Logo" 
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 object-contain rounded"
              />
              <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
                DHOTA<span className="text-[#D69A55]">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Building Trust. Constructing Quality. With 5+ years of experience, 
              we deliver exceptional construction services across Jharkhand.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/share/17mg2tZn1S/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
                data-testid="footer-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/dhota_construction?igsh=aHU3N3lmMmFpamo0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] transition-colors"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@dhotaconstruction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition-colors"
                data-testid="footer-youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/er-subhash-kumar-mahto-75991a368" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 flex items-center justify-center hover:bg-[#0A66C2] transition-colors"
                data-testid="footer-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Project Gallery", path: "/gallery" },
                { name: "Cost Estimator", path: "/estimator" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[#D69A55] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Residential Construction",
                "Commercial Buildings",
                "Renovation & Remodeling",
                "Interior & Exterior",
                "Project Management",
              ].map((service) => (
                <li key={service}>
                  <Link 
                    to="/services"
                    className="text-gray-400 hover:text-[#D69A55] transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D69A55] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Jainagar, Koderma,<br />
                  Jharkhand - 825109
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D69A55] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Bagodar, Giridih,<br />
                  Jharkhand - 825322
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a 
                  href="tel:+919110986889" 
                  className="flex items-center gap-3 text-gray-400 hover:text-[#D69A55] transition-colors"
                  data-testid="footer-phone"
                >
                  <Phone className="w-5 h-5 text-[#D69A55]" />
                  <span className="text-sm">+91 91109 86889</span>
                </a>
                <a 
                  href="https://wa.me/919110986889?text=Hello!%20I'm%20interested%20in%20your%20construction%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-500 hover:bg-green-600 flex items-center justify-center rounded-full transition-colors"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:email@dhotaconstruction.com" 
                  className="flex items-center gap-3 text-gray-400 hover:text-[#D69A55] transition-colors"
                  data-testid="footer-email"
                >
                  <Mail className="w-5 h-5 text-[#D69A55]" />
                  <span className="text-sm">email@dhotaconstruction.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:dhotaconstructions@gmail.com" 
                  className="flex items-center gap-3 text-gray-400 hover:text-[#D69A55] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#D69A55]" />
                  <span className="text-sm">dhotaconstructions@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} Dhota Construction. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 text-sm">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
