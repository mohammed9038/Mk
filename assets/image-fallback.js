document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.product-card-image');

  images.forEach(img => {
    // Check if image is already broken (e.g., loaded from cache as broken)
    if (img.complete && !img.naturalHeight) {
      handleImageError(img);
    }

    // Listen for new errors
    img.addEventListener('error', () => {
      handleImageError(img);
    });
  });

  function handleImageError(img) {
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }
});
