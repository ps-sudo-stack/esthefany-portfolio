// Tailwind CDN Configuration
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF5',
        'cream-card': '#FAF7EE',
        terracotta: '#C46D5B',
        'terracotta-hover': '#A85848',
        'sage-stem': '#9CB096',
        'pastel-yellow': '#F8E49B',
        'pastel-purple': '#C8B2DB',
        'charcoal-text': '#2D2B2A',
        'sand-border': '#E8DFCC'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif']
      }
    }
  }
};

// Gallery Photo Dataset
const photos = [
  "img/photo1.jpg",
  "img/photo2.jpg",
  "img/photo3.jpg",
  "img/photo4.jpg",
  "img/photo5.jpg",
  "img/photo6.jpg",
  "img/photo7.jpg",
  "img/photo8.jpg",
  "img/photo9.jpg"
];

let currentIndex = 0;

// DOM Elements
const featuredImgContainer = document.getElementById('featuredImgContainer');
const featuredImg = document.getElementById('featuredImg');
const prevMainBtn = document.getElementById('prevMainBtn');
const nextMainBtn = document.getElementById('nextMainBtn');
const thumbScrollContainer = document.getElementById('thumbScrollContainer');
const thumbPrevBtn = document.getElementById('thumbPrevBtn');
const thumbNextBtn = document.getElementById('thumbNextBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Lightbox Modal Elements
const photoLightbox = document.getElementById('photoLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

// Initialize bottom thumbnail strip items
function renderThumbnails() {
  thumbScrollContainer.innerHTML = '';
  photos.forEach((src, idx) => {
    const thumbWrapper = document.createElement('div');
    thumbWrapper.className = `relative flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-200 border-2 ${
      idx === currentIndex ? 'border-terracotta opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
    }`;
    
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = `Thumbnail ${idx + 1}`;
    thumb.className = `w-10 h-10 object-cover select-none`;
    thumb.setAttribute('ondragstart', 'return false;');

    thumbWrapper.appendChild(thumb);
    thumbWrapper.addEventListener('click', () => updateGallery(idx));
    thumbScrollContainer.appendChild(thumbWrapper);
  });
}

// Update main featured photo and active state
function updateGallery(index) {
  if (index < 0) currentIndex = photos.length - 1;
  else if (index >= photos.length) currentIndex = 0;
  else currentIndex = index;

  // Smooth fade transition
  featuredImg.style.opacity = '0.3';
  featuredImg.style.transform = 'scale(0.98)';

  setTimeout(() => {
    featuredImg.src = photos[currentIndex];
    featuredImg.style.opacity = '1';
    featuredImg.style.transform = 'scale(1)';
  }, 150);

  renderThumbnails();

  // Scroll thumbnail into view softly
  const activeThumb = thumbScrollContainer.children[currentIndex];
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  // Update Lightbox image if currently open
  if (!photoLightbox.classList.contains('hidden')) {
    lightboxImg.src = photos[currentIndex];
  }
}

// Direct selection handler for side grid photos
function selectPhoto(gridIndex) {
  updateGallery(gridIndex % photos.length);
}

// ==========================================================
// LIGHTBOX FULLSCREEN MODAL CONTROLS
// ==========================================================

function openLightbox() {
  lightboxImg.src = photos[currentIndex];
  photoLightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeLightbox() {
  photoLightbox.classList.add('hidden');
  document.body.style.overflow = ''; // Restore background scroll
}

// Event Listeners for Featured Center Image Click
featuredImgContainer.addEventListener('click', openLightbox);

// Lightbox Navigation Events
closeLightboxBtn.addEventListener('click', closeLightbox);
lightboxPrevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  updateGallery(currentIndex - 1);
});
lightboxNextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  updateGallery(currentIndex + 1);
});

// Close lightbox on clicking dark background backdrop
photoLightbox.addEventListener('click', (e) => {
  if (e.target === photoLightbox) {
    closeLightbox();
  }
});

// Keyboard Navigation Support (Escape, Left Arrow, Right Arrow)
document.addEventListener('keydown', (e) => {
  if (!photoLightbox.classList.contains('hidden')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateGallery(currentIndex - 1);
    if (e.key === 'ArrowRight') updateGallery(currentIndex + 1);
  }
});

// ==========================================================
// MAIN GALLERY & UI CONTROLS
// ==========================================================

prevMainBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
nextMainBtn.addEventListener('click', () => updateGallery(currentIndex + 1));

// Thumbnail Scroll Arrow Controls
thumbPrevBtn.addEventListener('click', () => {
  thumbScrollContainer.scrollBy({ left: -120, behavior: 'smooth' });
});
thumbNextBtn.addEventListener('click', () => {
  thumbScrollContainer.scrollBy({ left: 120, behavior: 'smooth' });
});

// Mobile Navigation Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// ==========================================================
// PHOTO PROTECTION (ANTI-SAVE & ANTI-RIGHT-CLICK)
// ==========================================================

// Disable Context Menu (Right Click) globally on all images and photo containers
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG' || e.target.closest('.photo-container') || e.target.closest('#photoLightbox')) {
    e.preventDefault();
    return false;
  }
});

// Disable Drag & Drop globally on all images
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    return false;
  }
});

// Initialize gallery on load
window.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});