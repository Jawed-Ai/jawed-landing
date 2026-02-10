/**
 * Jawed AI Landing Page - JavaScript
 * Handles countdown timer, navigation, and interactions
 */

(function () {
  "use strict";

  // ========================================
  // Configuration
  // ========================================

  // Target date: December 2, 2026 at 14:00 Palestine time (UTC+2 / UTC+3 DST)
  // Palestine observes DST, December is winter so UTC+2
  const TARGET_DATE = new Date("2026-02-12T14:00:00+02:00");
  const APK_PATH = "/assets/JawedAI.apk";

  // ========================================
  // DOM Elements
  // ========================================

  const elements = {
    menuToggle: document.querySelector(".menu-toggle"),
    navMenu: document.getElementById("nav-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    countdownContainer: document.getElementById("countdown-container"),
    downloadContainer: document.getElementById("download-container"),
    downloadBtn: document.getElementById("download-btn"),
    daysEl: document.getElementById("days"),
    hoursEl: document.getElementById("hours"),
    minutesEl: document.getElementById("minutes"),
    secondsEl: document.getElementById("seconds"),
    contactForm: document.getElementById("contact-form"),
    sections: document.querySelectorAll("section[id]"),
  };

  // ========================================
  // Countdown Timer
  // ========================================

  let countdownInterval = null;

  /**
   * Calculate time remaining until target date
   * @returns {Object} Object with days, hours, minutes, seconds, and total milliseconds
   */
  function getTimeRemaining() {
    const now = new Date().getTime();
    const target = TARGET_DATE.getTime();
    const total = target - now;

    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
  }

  /**
   * Pad number with leading zero
   * @param {number} num - Number to pad
   * @returns {string} Padded string
   */
  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  /**
   * Update countdown display
   */
  function updateCountdown() {
    const time = getTimeRemaining();

    if (time.total <= 0) {
      showDownloadButton();
      return;
    }

    // Update DOM elements
    if (elements.daysEl) elements.daysEl.textContent = padZero(time.days);
    if (elements.hoursEl) elements.hoursEl.textContent = padZero(time.hours);
    if (elements.minutesEl)
      elements.minutesEl.textContent = padZero(time.minutes);
    if (elements.secondsEl)
      elements.secondsEl.textContent = padZero(time.seconds);
  }

  /**
   * Show download button and hide countdown
   */
  function showDownloadButton() {
    // Clear interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    // Hide countdown, show download
    if (elements.countdownContainer) {
      elements.countdownContainer.classList.add("hidden");
    }
    if (elements.downloadContainer) {
      elements.downloadContainer.classList.remove("hidden");
    }
  }

  /**
   * Initialize countdown timer
   */
  function initCountdown() {
    // Check if already past target date
    const time = getTimeRemaining();

    if (time.total <= 0) {
      showDownloadButton();
      return;
    }

    // Initial update
    updateCountdown();

    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // ========================================
  // Download Handler
  // ========================================

  /**
   * Handle APK download
   * @param {Event} e - Click event
   */
  function handleDownload(e) {
    e.preventDefault();

    // Create temporary link element
    const link = document.createElement("a");
    link.href = APK_PATH;
    link.download = "JawedAI.apk";
    link.style.display = "none";

    // Append, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ========================================
  // Mobile Navigation
  // ========================================

  /**
   * Toggle mobile menu
   */
  function toggleMenu() {
    const isOpen = elements.menuToggle.getAttribute("aria-expanded") === "true";

    elements.menuToggle.setAttribute("aria-expanded", !isOpen);
    elements.navMenu.classList.toggle("open");

    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? "hidden" : "";

    // Update aria-label
    elements.menuToggle.setAttribute(
      "aria-label",
      !isOpen ? "إغلاق القائمة" : "فتح القائمة",
    );
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    elements.menuToggle.setAttribute("aria-expanded", "false");
    elements.navMenu.classList.remove("open");
    document.body.style.overflow = "";
    elements.menuToggle.setAttribute("aria-label", "فتح القائمة");
  }

  /**
   * Initialize mobile navigation
   */
  function initMobileNav() {
    if (!elements.menuToggle || !elements.navMenu) return;

    // Toggle button click
    elements.menuToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking a link
    elements.navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && elements.navMenu.classList.contains("open")) {
        closeMenu();
        elements.menuToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        elements.navMenu.classList.contains("open") &&
        !elements.navMenu.contains(e.target) &&
        !elements.menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // ========================================
  // Active Navigation Link
  // ========================================

  /**
   * Update active navigation link based on scroll position
   */
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    elements.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        elements.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  /**
   * Initialize scroll spy for navigation
   */
  function initScrollSpy() {
    // Throttle scroll events
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNavLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    updateActiveNavLink();
  }

  // ========================================
  // Smooth Scroll
  // ========================================

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          const targetPosition = targetElement.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // ========================================
  // Contact Form
  // ========================================

  /**
   * Handle contact form submission
   * @param {Event} e - Submit event
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(elements.contactForm);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email || !data.message) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    // In a real app, you would send this to a server
    // For now, just show a success message
    alert("شكراً لتواصلك معنا! سنرد عليك قريباً.");
    elements.contactForm.reset();
  }

  /**
   * Initialize contact form
   */
  function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener("submit", handleFormSubmit);
  }

  // ========================================
  // Navbar Scroll Effect
  // ========================================

  /**
   * Add/remove shadow on navbar based on scroll
   */
  function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 10) {
            navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
          } else {
            navbar.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ========================================
  // Initialize
  // ========================================

  /**
   * Initialize all functionality
   */
  function init() {
    // Core functionality
    initCountdown();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initContactForm();
    initNavbarScroll();

    // Download button handler
    if (elements.downloadBtn) {
      elements.downloadBtn.addEventListener("click", handleDownload);
    }

    console.log("Jawed AI landing page initialized successfully.");
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
