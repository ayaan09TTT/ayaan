/**
 * Utility for loading and managing the Razorpay SDK script
 */
const RazorpayScript = {
  /**
   * Loads the Razorpay SDK script if it's not already loaded
   * @returns {Promise<void>} - Promise that resolves when the script is loaded
   */
  load: () => {
    return new Promise((resolve) => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      if (window.Razorpay) {
        // Script already loaded
        resolve();
        return;
      }

      try {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        // Set up event handlers
        script.onload = () => {
          resolve();
        };
        
        script.onerror = () => {
          console.warn('Failed to load Razorpay SDK, but continuing');
          resolve(); // Resolve anyway to prevent blocking app startup
        };

        // Add the script to the document
        document.body.appendChild(script);
      } catch (error) {
        console.warn('Error loading Razorpay script:', error);
        resolve(); // Resolve anyway to prevent blocking app startup
      }
    });
  },
  
  /**
   * Removes the Razorpay SDK script from the document
   */
  unload: () => {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      if (script.src.includes('checkout.razorpay.com')) {
        script.remove();
      }
    });
    
    // Also clear the global Razorpay object
    if (window.Razorpay) {
      delete window.Razorpay;
    }
  }
};

export default RazorpayScript;