const revealCards = [...document.querySelectorAll("[data-reveal]")];
const skyWord = document.querySelector(".sky-word");
const ghostLabs = [...document.querySelectorAll(".ghost-lab")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setSkyScroll() {
  if (!skyWord || prefersReducedMotion.matches) return;
  const rect = skyWord.parentElement.getBoundingClientRect();
  const drift = Math.round((window.innerHeight - rect.top) * 0.18);
  skyWord.style.backgroundPosition = `calc(50% + ${drift}px) calc(50% + ${drift * 0.45}px)`;
  skyWord.style.transform = `translateX(${Math.sin(drift / 160) * 3}vw)`;
}

window.addEventListener("scroll", setSkyScroll, { passive: true });
window.addEventListener("resize", setSkyScroll);

ghostLabs.forEach((ghostLab) => {
  if (prefersReducedMotion.matches) return;
  const ghosts = [...ghostLab.querySelectorAll(".ghost")];
  if (ghosts.length === 0) return;

  const moveGhosts = (event) => {
    const rect = ghostLab.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ghosts.forEach((ghost) => {
      ghost.style.left = `${x}px`;
      ghost.style.top = `${y}px`;
    });
  };

  ghostLab.addEventListener("pointermove", moveGhosts);
  document.addEventListener("pointermove", (event) => {
    const rect = ghostLab.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (inside) moveGhosts(event);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.28 }
);

revealCards.forEach((card) => observer.observe(card));
setSkyScroll();
