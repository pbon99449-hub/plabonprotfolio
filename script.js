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
    ScrollReveal().reveal(".project-title, .contact-title, .skills-title", {
      origin: "top"
    });
    ScrollReveal().reveal(".projects, .contact", {
      origin: "bottom"
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
