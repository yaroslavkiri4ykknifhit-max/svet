(() => {
  "use strict";

  /**
   * LIGHTFORM — premium one-page landing
   * Dependencies:
   *   - GSAP
   *   - ScrollTrigger
   *   - Lenis
   *
   * The page degrades gracefully if an animation dependency is unavailable.
   */

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const state = {
    lenis: null,
    gsapReady: typeof window.gsap !== "undefined",
    scrollTriggerReady: typeof window.ScrollTrigger !== "undefined",
  };

  function setLiveTime() {
    const clock = $("#liveTime");
    if (!clock) return;

    const formatter = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Minsk",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const update = () => {
      clock.textContent = formatter.format(new Date());
    };

    update();
    window.setInterval(update, 30_000);
  }

  function preloadSite() {
    const preloader = $("#preloader");
    const bar = $("#preloaderBar");
    const percent = $("#preloaderPercent");

    if (!preloader || !bar || !percent) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (prefersReducedMotion) {
        bar.style.width = "100%";
        percent.textContent = "100";
        preloader.remove();
        resolve();
        return;
      }

      let progress = 0;
      const interval = window.setInterval(() => {
        progress += Math.round(Math.random() * 9) + 4;
        progress = Math.min(progress, 100);

        bar.style.width = `${progress}%`;
        percent.textContent = progress.toString().padStart(2, "0");

        if (progress >= 100) {
          window.clearInterval(interval);

          gsap.to(preloader, {
            duration: 1.05,
            opacity: 0,
            filter: "blur(16px)",
            ease: "power3.inOut",
            onComplete: () => {
              preloader.remove();
              resolve();
            }
          });
        }
      }, 65);
    });
  }

  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === "undefined") {
      return;
    }

    state.lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 0.9
    });

    state.lenis.on("scroll", ScrollTrigger?.update);

    gsap.ticker.add((time) => {
      state.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  function splitTextIntoLines() {
    $$(".split-reveal").forEach((heading) => {
      // The markup already has semantic line breaks; wrap each visible line for reveal.
      heading.querySelectorAll(":scope > span").forEach((line) => {
        const inner = line.textContent;
        line.innerHTML = `<span class="split-line-inner">${inner}</span>`;
        line.querySelector(".split-line-inner").style.display = "inline-block";
      });
    });
  }

  function initHeroIntro() {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" }
    });

    tl.fromTo(
      ".hero__eyebrow",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
      .fromTo(
        ".hero__kicker",
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.45"
      )
      .fromTo(
        ".split-line-inner",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.05, stagger: 0.12 },
        "-=0.35"
      )
      .fromTo(
        ".hero__lead",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.55"
      )
      .fromTo(
        ".hero__actions",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        "-=0.45"
      )
      .fromTo(
        ".hero__side-card",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        "-=0.5"
      )
      .fromTo(
        ".hero__bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.55 },
        "-=0.3"
      );
  }

  function initScrollAnimations() {
    if (!state.gsapReady || !state.scrollTriggerReady) return;

    gsap.registerPlugin(ScrollTrigger);

    // Main "light turns on" effect: the brighter image gradually uncovers from below.
    gsap.to(".hero__image--light", {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.25
      }
    });

    gsap.to(".hero__image--dark", {
      filter: "brightness(.12) saturate(.5) contrast(1.12)",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.25
      }
    });

    gsap.to(".hero__image", {
      yPercent: -4,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(".hero__light-orb--one", {
      opacity: 0.55,
      scale: 1.8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(".hero__light-orb--two", {
      opacity: 0.42,
      scale: 1.7,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    // Section reveals
    $$(".text-reveal").forEach((element) => {
      gsap.to(element, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true
        }
      });
    });

    $$(".reveal-panel").forEach((element, index) => {
      gsap.to(element, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: (index % 3) * 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 87%",
          once: true
        }
      });
    });

    // Project media parallax.
    $$("[data-parallax-card]").forEach((card) => {
      const image = $("img[data-depth]", card);
      if (!image) return;

      gsap.to(image, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9
        }
      });
    });

    // Contact background parallax.
    const contactImage = $("[data-parallax-image]");
    if (contactImage) {
      gsap.to(contactImage, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  }

  function initMouseParallax() {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = $("#cursorGlow");

    window.addEventListener("pointermove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      if (cursor && state.gsapReady) {
        gsap.to(cursor, {
          x: event.clientX,
          y: event.clientY,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out"
        });
      }

      $$("[data-parallax]").forEach((element) => {
        const speed = Number(element.dataset.speed || 0.05);

        gsap.to(element, {
          x: x * speed * -80,
          y: y * speed * -80,
          duration: 0.9,
          ease: "power3.out",
          overwrite: true
        });
      });
    });

    document.addEventListener("mouseleave", () => {
      if (!cursor || !state.gsapReady) return;

      gsap.to(cursor, {
        opacity: 0,
        duration: 0.3
      });
    });
  }

  function initMagneticButtons() {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    $$(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.11,
          y: y * 0.11,
          duration: 0.45,
          ease: "power3.out"
        });
      });

      element.addEventListener("pointerleave", () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.35)"
        });
      });
    });
  }

  function initContactForm() {
    const form = $("#contactForm");
    const status = $("#formStatus");

    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const contact = String(formData.get("contact") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (name.length < 2 || contact.length < 5 || message.length < 5) {
        status.textContent = "Заполните имя, контакт и коротко опишите объект.";
        return;
      }

      // Demo-safe frontend handler: no data is sent anywhere.
      // Connect this submit handler to your API/CRM endpoint before production use.
      status.textContent = "Заявка подготовлена. Подключите CRM/API в обработчике формы.";
      form.reset();
    });
  }

  async function boot() {
    setLiveTime();

    if (!state.gsapReady || !state.scrollTriggerReady) {
      document.documentElement.classList.add("no-gsap");
      await preloadSite();
      return;
    }

    splitTextIntoLines();
    await preloadSite();

    if (prefersReducedMotion) {
      $$(".reveal-line, .reveal-panel").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      $$(".text-reveal").forEach((element) => {
        element.style.clipPath = "inset(0% 0% 0% 0%)";
      });
      initContactForm();
      return;
    }

    initLenis();
    initHeroIntro();
    initScrollAnimations();
    initMouseParallax();
    initMagneticButtons();
    initContactForm();

    // Give ScrollTrigger a fresh layout after fonts/images settle.
    window.setTimeout(() => ScrollTrigger.refresh(), 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
