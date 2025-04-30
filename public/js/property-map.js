/**
 * Property Map Functions
 * Handles map embedding and lazy loading for property details page
 */

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePropertyMap();
});

// Main initialization function
function initializePropertyMap() {
  const locationButton = document.querySelector('[data-bs-target="#collapseLocation"]');
  const mapIframe = document.querySelector('.ratio-16x9 iframe');
  
  if (!locationButton || !mapIframe) return;
  
  // Get original src from data-src attribute
  const originalSrc = mapIframe.getAttribute('data-src');
  
  // Only load map when the section is expanded
  locationButton.addEventListener('click', function() {
    const isCollapsed = locationButton.classList.contains('collapsed');
    
    if (!isCollapsed && mapIframe.getAttribute('src') === '') {
      // Set timeout to wait for the accordion animation to complete
      setTimeout(() => {
        mapIframe.setAttribute('src', originalSrc);
      }, 350);
    }
  });
  
  // Handle accordion state on page load
  const locationAccordion = document.getElementById('collapseLocation');
  if (locationAccordion && locationAccordion.classList.contains('show')) {
    mapIframe.setAttribute('src', originalSrc);
  }
  
  // Add event listener to handle browser back button
  window.addEventListener('popstate', function() {
    setTimeout(() => {
      const locationAccordion = document.getElementById('collapseLocation');
      if (locationAccordion && locationAccordion.classList.contains('show') && mapIframe.getAttribute('src') === '') {
        mapIframe.setAttribute('src', originalSrc);
      }
    }, 350);
  });
} 