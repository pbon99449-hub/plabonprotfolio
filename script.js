// Keep refreshes anchored at the top instead of restoring an old scroll position.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", function() {
  var headerArea = document.querySelector(".header-area");
  var menuButton = document.querySelector(".menu_icon");
  var navbar = document.querySelector(".navbar");
  var navLinks = document.querySelectorAll(".navbar a");
  var skillSection = document.querySelector(".skills-content");
  var contactForm = document.forms["submitToGoogleSheet"];
  var message = document.getElementById("msg");
  var contactScriptURL = "https://script.google.com/macros/s/AKfycbyS83UGYm7c5KHjN6_zIbhm7yvxKYjW_IjBJUULS8zRFaj-FzZtY3W8qWveS0gY0mrZ/exec";

  function setMenuOpen(isOpen) {
    if (!menuButton || !navbar) return;

    var icon = menuButton.querySelector("i");
    navbar.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-times", isOpen);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function getHeaderHeight() {
    return headerArea ? headerArea.offsetHeight : 0;
  }

  function scrollToTarget(target) {
    if (!target) return;

    var destination = 0;
    if (target !== "#home") {
      var section = document.querySelector(target);
      if (!section) return;
      destination = section.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() - 24;
    }

    window.scrollTo({
      top: Math.max(0, destination),
      behavior: "smooth"
    });
  }

  function updateActiveSection() {
    var focusPoint = window.pageYOffset + getHeaderHeight() + 40;
    var currentId = "home";

    document.querySelectorAll("#home, section[id]").forEach(function(section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;

      if (focusPoint >= top && focusPoint < bottom) {
        currentId = section.id;
      }
    });

    if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 6) {
      currentId = "contact";
    }

    navLinks.forEach(function(link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  function updateStickyHeader() {
    if (headerArea) {
      headerArea.classList.toggle("sticky", window.pageYOffset > 1);
    }
    updateActiveSection();
  }

  function animateSkillBars() {
    if (!skillSection) return;

    if (skillSection.getBoundingClientRect().top < window.innerHeight - 100) {
      document.querySelectorAll(".progress-fill").forEach(function(bar) {
        bar.style.width = bar.getAttribute("data-progress") + "%";
        bar.classList.add("animate");
      });
      window.removeEventListener("scroll", animateSkillBars);
    }
  }

  if (menuButton && navbar) {
    menuButton.addEventListener("click", function() {
      setMenuOpen(!navbar.classList.contains("active"));
    });
  }

  navLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
      var target = link.getAttribute("href");

      if (target && target.charAt(0) === "#") {
        event.preventDefault();
        closeMenu();
        scrollToTarget(target);
      }
    });
  });

  document.addEventListener("keyup", function(event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function() {
    if (window.innerWidth > 767) {
      closeMenu();
    }
    updateActiveSection();
  });

  window.addEventListener("scroll", updateStickyHeader, { passive: true });
  window.addEventListener("scroll", animateSkillBars, { passive: true });
  setTimeout(animateSkillBars, 500);

  // Typing effect for hero roles
  if (typeof Typed !== "undefined") {
    try {
      new Typed(".typed-role", {
        strings: ["Web Developer", "Frontend Developer", "React Developer", "Problem Solver"],
        typeSpeed: 55,
        backSpeed: 28,
        backDelay: 1700,
        loop: true,
        showCursor: true,
        cursorChar: "|"
      });
    } catch (error) {
      console.error("Typed.js failed", error);
    }
  }

  // Animated stat counters
  var countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    var statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;
    if (statsSection.getBoundingClientRect().top < window.innerHeight - 60) {
      countersAnimated = true;
      document.querySelectorAll(".stat-number").forEach(function(counter) {
        var target = parseInt(counter.getAttribute("data-target") || "0", 10);
        var suffix = counter.getAttribute("data-suffix") || "";
        var startTime = null;
        var duration = 1600;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      });
      window.removeEventListener("scroll", animateCounters);
    }
  }
  window.addEventListener("scroll", animateCounters, { passive: true });
  setTimeout(animateCounters, 500);

  // Reading progress bar
  var progressBar = document.getElementById("progressBar");
  function updateProgressBar() {
    if (!progressBar) return;
    var scrollable = document.body.scrollHeight - window.innerHeight;
    var scrolled = window.pageYOffset;
    var progress = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
    progressBar.style.width = Math.min(100, progress) + "%";
  }
  window.addEventListener("scroll", updateProgressBar, { passive: true });
  updateProgressBar();

  // Dynamic copyright year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Back to top
  var backToTop = document.getElementById("backToTop");
  function updateBackToTop() {
    if (!backToTop) return;
    var visible = window.pageYOffset > 450;
    backToTop.classList.toggle("show", visible);
  }
  if (backToTop) {
    backToTop.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  // Copy email to clipboard
  var copyEmailButton = document.querySelector(".copy-email");
  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", function() {
      var email = "pbon99449@gmail.com";
      function showCopied() {
        var icon = copyEmailButton.querySelector("i");
        if (!icon) return;
        icon.classList.remove("fa-copy");
        icon.classList.add("fa-check");
        setTimeout(function() {
          icon.classList.add("fa-copy");
          icon.classList.remove("fa-check");
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(showCopied);
      } else {
        var tempInput = document.createElement("textarea");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        try { document.execCommand("copy"); } catch (error) {}
        document.body.removeChild(tempInput);
        showCopied();
      }
    });
  }

  if (window.ScrollReveal) {
    ScrollReveal({
      distance: "60px",
      duration: 1200,
      delay: 100,
      viewFactor: 0.15,
      cleanup: true
    });

    ScrollReveal().reveal(".header a, .profile-photo, .about-content, .education, .skill-item:nth-child(odd)", {
      origin: "left"
    });
    ScrollReveal().reveal(".profile-text, .about-skills, .internship, .skill-item:nth-child(even)", {
      origin: "right"
    });
    ScrollReveal().reveal(".project-title, .contact-title, .skills-title, .services-title", {
      origin: "top"
    });

    ScrollReveal().reveal(".stats-section, .services-grid", {
      origin: "bottom"
    });
    ScrollReveal().reveal(".projects, .contact-cards", {
      origin: "bottom"
    });

    ScrollReveal().reveal(".contact-info, .footer", {
      origin: "left"
    });

    ScrollReveal().reveal(".contact-form", {
      origin: "right"
    });
  }

  if (contactForm && message) {
    contactForm.addEventListener("submit", function(event) {
      event.preventDefault();

      var submitButton = contactForm.querySelector(".submit");
      if (submitButton) {
        submitButton.value = "Sending...";
        submitButton.disabled = true;
      }

      fetch(contactScriptURL, {
        method: "POST",
        body: new FormData(contactForm)
      })
        .then(function() {
          message.innerHTML = "Message sent successfully";
          message.style.color = "#4CAF50";
          setTimeout(function() {
            message.innerHTML = "";
          }, 5000);
          contactForm.reset();
        })
        .catch(function(error) {
          message.innerHTML = "Failed to send message. Please try again.";
          message.style.color = "#ff4444";
          console.error("Error!", error.message);
        })
        .finally(function() {
          if (submitButton) {
            submitButton.value = "Send Message";
            submitButton.disabled = false;
          }
        });
    });
  }

  updateStickyHeader();
  updateActiveSection();
});
