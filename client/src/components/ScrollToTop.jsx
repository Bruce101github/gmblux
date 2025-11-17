import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis will handle smooth scrolling, but we ensure scroll position resets
    // The SmoothScroll component handles the actual scrolling
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
