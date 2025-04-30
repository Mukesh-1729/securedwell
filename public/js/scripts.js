// Function to remove modal backdrop
function removeModalBackdrop() {
  // Remove any lingering backdrop elements
  const backdrops = document.getElementsByClassName('modal-backdrop');
  while (backdrops.length > 0) {
    backdrops[0].parentNode.removeChild(backdrops[0]);
  }
  
  // Remove modal-open class from body to restore scrolling
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
} 