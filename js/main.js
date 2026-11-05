/**
 * ====================================================================
 * MAIN SCRIPT - PORTFOLIO INTERACTIVITY
 * ====================================================================
 * Handles project rendering, mobile menu, active navigation tracking,
 * client-side form validation, and smooth micro-interactions.
 */

import { projects } from './projects.js';
import { initTheme, setupThemeToggles } from './theme.js';

/**
 * CONFIGURATION & ENDPOINTS
 * REPLACE with your personal info or Formspree endpoint when ready!
 */
const CONFIG = {
  // Formspree or Web3Forms endpoint:
  // e.g. "https://formspree.io/f/my-form-id" or "https://api.web3forms.com/submit"
  formEndpoint: "https://formspree.io/f/your-form-id",
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Dark/Light)
  initTheme();
  setupThemeToggles();

  // 2. Render Projects Gallery
  initProjectsGallery();

  // 3. Setup Navigation & Mobile Menu
  setupNavigation();

  // 4. Setup Contact Form Validation & Submission
  setupContactForm();

  // 5. Update Dynamic Footer Year
  updateCopyrightYear();

  // 6. Setup Back-to-Top Button
  setupBackToTop();
});

/**
 * ====================================================================
 * 1. PROJECTS GALLERY RENDERING & FILTERING
 * ====================================================================
 */
function initProjectsGallery() {
  const container = document.getElementById('projects-grid');
  const filterContainer = document.getElementById('project-filters');
  if (!container) return;

  // Extract unique categories
  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  // Render filter buttons if multiple categories exist
  if (filterContainer && categories.length > 2) {
    filterContainer.innerHTML = categories
      .map(
        (cat, i) => `
        <button
          type="button"
          data-category="${cat}"
          class="project-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            i === 0
              ? 'active-filter bg-primary-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-500'
          }"
        >
          ${cat}
        </button>
      `
      )
      .join('');

    // Attach filter listeners
    const buttons = filterContainer.querySelectorAll('.project-filter-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active-filter', 'bg-primary-600', 'text-white', 'shadow-sm');
          b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-700');
        });

        btn.classList.add('active-filter', 'bg-primary-600', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border');

        const chosenCat = btn.getAttribute('data-category');
        renderCards(chosenCat);
      });
    });
  }

  // Initial render
  renderCards('All');

  function renderCards(category) {
    const list = category === 'All' ? projects : projects.filter((p) => p.category === category);

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
          No projects found in this category.
        </div>
      `;
      return;
    }

    container.innerHTML = list
      .map(
        (project) => `
        <article class="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500/50 dark:hover:border-primary-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <!-- Screenshot -->
          <div class="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src="${project.image}"
              alt="Screenshot of ${project.title}"
              loading="lazy"
              class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            ${
              project.category
                ? `<span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">${project.category}</span>`
                : ''
            }
            ${
              project.featured
                ? `<span class="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-600 text-white shadow-sm">Featured</span>`
                : ''
            }
          </div>

          <!-- Card Content -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                ${project.title}
              </h3>

              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                ${project.description}
              </p>
            </div>

            <div>
              <!-- Tech Badges -->
              <div class="flex flex-wrap gap-1.5 mb-6">
                ${project.tags
                  .map(
                    (tag) => `
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    ${tag}
                  </span>
                `
                  )
                  .join('')}
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <a
                  href="${project.liveUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="View live demo of ${project.title}"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>

                <a
                  href="${project.githubUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all duration-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="View source code of ${project.title} on GitHub"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }
}

/**
 * ====================================================================
 * 2. NAVIGATION & MOBILE MENU
 * ====================================================================
 */
function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll detection for sticky navbar background and active nav item
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar glassmorphism
    if (scrollY > 20) {
      navbar.classList.add('bg-white/85', 'dark:bg-slate-950/85', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-200/70', 'dark:border-slate-800/70', 'py-3.5');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.remove('bg-white/85', 'dark:bg-slate-950/85', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-200/70', 'dark:border-slate-800/70', 'py-3.5');
      navbar.classList.add('bg-transparent', 'py-5');
    }

    // Active Section Tracking
    let current = '';
    const scrollPosition = scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active-nav-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav-link');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking any mobile nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    `;
  }
}

/**
 * ====================================================================
 * 3. CONTACT FORM VALIDATION & SUBMISSION
 * ====================================================================
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const successBanner = document.getElementById('form-success');
  const errorBanner = document.getElementById('form-error');
  const errorText = document.getElementById('form-error-text');

  // Real-time blur validation
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('border-rose-400')) {
        validateField(input);
      }
    });
  });

  function validateField(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let message = '';

    if (input.id === 'name') {
      if (!input.value.trim()) {
        isValid = false;
        message = 'Please enter your name.';
      } else if (input.value.trim().length < 2) {
        isValid = false;
        message = 'Name must be at least 2 characters.';
      }
    } else if (input.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input.value.trim()) {
        isValid = false;
        message = 'Please enter your email address.';
      } else if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        message = 'Please provide a valid email address.';
      }
    } else if (input.id === 'message') {
      if (!input.value.trim()) {
        isValid = false;
        message = 'Please enter your message.';
      } else if (input.value.trim().length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters.';
      }
    }

    if (!isValid) {
      input.classList.add('border-rose-400', 'dark:border-rose-600', 'focus:ring-rose-400');
      input.classList.remove('border-slate-300', 'dark:border-slate-700', 'focus:ring-primary-500');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
      }
    } else {
      input.classList.remove('border-rose-400', 'dark:border-rose-600', 'focus:ring-rose-400');
      input.classList.add('border-slate-300', 'dark:border-slate-700', 'focus:ring-primary-500');
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
      }
    }

    return isValid;
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    // Set Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending Message...
    `;

    successBanner.classList.add('hidden');
    errorBanner.classList.add('hidden');

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    try {
      // Check if endpoint is still default placeholder
      const isPlaceholder = !CONFIG.formEndpoint || CONFIG.formEndpoint.includes('your-form-id');

      if (isPlaceholder) {
        // Simulated submission mode
        await new Promise((resolve) => setTimeout(resolve, 800));
        successBanner.classList.remove('hidden');
        form.reset();
        return;
      }

      // Live submission
      const res = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        successBanner.classList.remove('hidden');
        form.reset();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit form. Please try reaching out via direct email.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      if (errorText) {
        errorText.textContent = err.message || 'Something went wrong. Please try again or email me directly.';
      }
      errorBanner.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * ====================================================================
 * 4. DYNAMIC COPYRIGHT YEAR
 * ====================================================================
 */
function updateCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * ====================================================================
 * 5. BACK TO TOP BUTTON
 * ====================================================================
 */
function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
