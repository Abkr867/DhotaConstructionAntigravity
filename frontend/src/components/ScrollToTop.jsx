import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * ScrollToTop component:
 * 1. Automatically redirects legacy '#/...' hash URLs to clean paths ('/...').
 * 2. Listens to location changes in react-router-dom (BrowserRouter)
 *    and resets scroll position immediately to top (0, 0).
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  // Redirect legacy hash-based URLs (e.g. https://deshdarshantravels.com/#/admin -> /admin)
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith("#/")) {
      const cleanPath = window.location.hash.replace(/^#/, "");
      navigate(cleanPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // If navigating to an in-page element with an anchor hash
    if (hash && !hash.startsWith("#/")) {
      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Scroll window immediately to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    // Also reset scroll on document root and body
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Handle any outer App container if it has overflow
    const appEl = document.querySelector(".App");
    if (appEl) {
      appEl.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
