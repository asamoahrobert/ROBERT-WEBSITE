/**
 * ====================================================================
 * THEME MANAGER (DARK / LIGHT MODE)
 * ====================================================================
 * Manages theme switching, localStorage persistence, and system preference detection.
 */

const THEME_KEY = 'robert-asamoah-portfolio-theme';

/**
 * Initializes the theme based on localStorage or system preference.
 * Called immediately on script load.
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    applyTheme('dark');
  } else if (savedTheme === 'light') {
    applyTheme('light');
  } else {
    // Default to dark mode for developer portfolio aesthetic
    applyTheme('dark');
  }

  // Listen to system changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Applies the given theme to <html> and updates toggle icons
 * @param {'dark' | 'light'} theme 
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update theme toggle button UI (aria-label and visual state)
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach((btn) => {
    btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);

    const sunIcon = btn.querySelector('.theme-sun-icon');
    const moonIcon = btn.querySelector('.theme-moon-icon');

    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  });
}

/**
 * Toggles between dark and light themes and saves to localStorage
 */
export function toggleTheme() {
  const isCurrentlyDark = document.documentElement.classList.contains('dark');
  const newTheme = isCurrentlyDark ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

// Attach event listeners to toggle buttons once DOM is loaded
export function setupThemeToggles() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
}
