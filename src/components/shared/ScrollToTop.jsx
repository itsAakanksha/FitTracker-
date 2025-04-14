import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll the window to the top whenever
// the pathname changes (i.e., when navigation occurs)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
    
    // If you have containers with their own scrollbars that need to be reset,
    // you can select them and reset their scroll position here as well
    const scrollableElements = document.querySelectorAll('.custom-scrollbar');
    scrollableElements.forEach(element => {
      if (element.scrollTo) {
        element.scrollTo(0, 0);
      } else {
        element.scrollTop = 0;
      }
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;