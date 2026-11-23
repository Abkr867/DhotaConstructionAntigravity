import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component:
 * Listens to location changes in react-router-dom (HashRouter)
 * and resets scroll position immediately to top (0, 0)
 * so every page starts from the very beginning.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

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
