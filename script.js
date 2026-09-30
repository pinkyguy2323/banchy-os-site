(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyLanguage(lang) {
    var nodes = doc.querySelectorAll("[data-en][data-ru]");
    var value;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].hasAttribute("data-locked")) continue;
      value = nodes[i].getAttribute("data-" + lang);
      if (value !== null) nodes[i].textContent = value;
    }
    root.setAttribute("lang", lang);

    var buttons = doc.querySelectorAll(".lang-btn");
    for (var j = 0; j < buttons.length; j++) {
      var active = buttons[j].getAttribute("data-lang") === lang;
      buttons[j].classList.toggle("is-active", active);
      buttons[j].setAttribute("aria-pressed", active ? "true" : "false");
    }

    try {
      localStorage.setItem("banchy-lang", lang);
    } catch (e) {}
  }

  var stored = null;
  try {
    stored = localStorage.getItem("banchy-lang");
  } catch (e) {}

  applyLanguage(stored === "ru" || stored === "en" ? stored : "en");

  var langToggle = doc.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function (event) {
      var btn = event.target.closest(".lang-btn");
      if (!btn) return;
      applyLanguage(btn.getAttribute("data-lang"));
    });
  }

  var navToggle = doc.getElementById("nav-toggle");
  var nav = doc.getElementById("primary-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var revealItems = doc.querySelectorAll(".reveal");
  for (var r = 0; r < revealItems.length; r++) {
    var delay = revealItems[r].getAttribute("data-delay");
    if (delay) revealItems[r].style.setProperty("--reveal-delay", delay + "ms");
  }

  if (reduced || !("IntersectionObserver" in window)) {
    for (var k = 0; k < revealItems.length; k++) revealItems[k].classList.add("is-visible");
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    for (var m = 0; m < revealItems.length; m++) observer.observe(revealItems[m]);
  }

  function fetchRelease() {
    var versionEl = doc.getElementById("release-version");
    var shaLink = doc.getElementById("sha256-link");
    var shaText = doc.getElementById("sha256-text");
    var url = "https://api.github.com/repos/pinkyguy2323/banchy-os/releases/latest";

    if (!window.fetch) return;

    fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("release lookup failed");
        return res.json();
      })
      .then(function (data) {
        if (versionEl && data && data.tag_name) {
          versionEl.textContent = data.tag_name;
          versionEl.setAttribute("data-locked", "");
        }

        if (shaLink && shaText && data && Array.isArray(data.assets)) {
          var asset = data.assets.filter(function (a) {
            return a && a.name && /\.sha256$/i.test(a.name);
          })[0];
          if (asset && asset.browser_download_url) {
            shaLink.href = asset.browser_download_url;
            shaText.textContent = asset.name;
            shaText.setAttribute("data-locked", "");
            shaLink.setAttribute("download", "");
          }
        }
      })
      .catch(function () {});
  }

  fetchRelease();
})();
