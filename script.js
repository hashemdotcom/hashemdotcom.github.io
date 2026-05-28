const meter = document.querySelector(".scroll-meter span");
const glow = document.querySelector(".cursor-glow");
const storyRail = document.querySelector(".story-rail");
const chapters = [...document.querySelectorAll(".chapter")];
const sceneImages = [...document.querySelectorAll(".scene-img")];
const count = document.querySelector(".chapter-count .current");
const revealCards = [...document.querySelectorAll("[data-reveal]")];
const scrollComputers = [...document.querySelectorAll(".scroll-computer")];
const skyWord = document.querySelector(".sky-word");
const ghostLabs = [...document.querySelectorAll(".ghost-lab")];
const brandBubble = document.querySelector(".brand-bubble");
const sectionComments = [
  { selector: ".hero", text: "Hi, I'm Melika. Start with the big picture." },
  { selector: ".sky-scroll-section", text: "This part is about VR, perception, and softness." },
  { selector: "#story", text: "This is the short version of my path so far." },
  { selector: "#work", text: "Work mode: React, Django, APIs, and delivery." },
  { selector: "#resume", text: "Resume map: education, skills, languages, certs." },
  { selector: "#contact", text: "Ready to connect? Email, LinkedIn, or CV." },
];

const tilts = ["-2deg", "3deg", "-4deg", "2deg"];

function setProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (meter) meter.style.height = `${progress * 100}%`;
}

function setChapter() {
  if (!storyRail || chapters.length === 0) return;
  const rect = storyRail.getBoundingClientRect();
  const distance = storyRail.offsetHeight - window.innerHeight;
  const raw = Math.min(Math.max(-rect.top / Math.max(distance, 1), 0), 0.999);
  const index = Math.floor(raw * chapters.length);

  chapters.forEach((chapter, chapterIndex) => {
    chapter.classList.toggle("active", chapterIndex === index);
  });

  sceneImages.forEach((image, imageIndex) => {
    image.classList.toggle("active", imageIndex === index);
    image.style.setProperty("--tilt", tilts[imageIndex]);
    const drift = (raw * 70 - imageIndex * 8).toFixed(2);
    image.style.objectPosition = `50% ${50 + Number(drift) * 0.08}%`;
  });

  if (count) count.textContent = String(index + 1).padStart(2, "0");
}

function updateScrollEffects() {
  setProgress();
  setChapter();
  setComputerFlight();
  setSkyScroll();
  setSectionComment();
}

function setComputerFlight() {
  if (scrollComputers.length === 0) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.pageYOffset / scrollable : 0;
  const paths = [
    { start: 0.04, end: 0.92, xBase: -50, xAmp: 34, yStart: -12, yRange: 104, spin: 44 },
    { start: 0.16, end: 0.78, xBase: 48, xAmp: -26, yStart: -18, yRange: 92, spin: -58 },
  ];

  scrollComputers.forEach((computer, index) => {
    const path = paths[index] || paths[0];
    const active = Math.min(Math.max((progress - path.start) / (path.end - path.start), 0), 1);
    const wave = Math.sin(active * Math.PI * (index === 0 ? 5 : 4));
    const x = path.xBase + wave * path.xAmp;
    const y = path.yStart + active * path.yRange;
    const rotate = (index === 0 ? -18 : 16) + active * path.spin + wave * 9;
    const scale = (index === 0 ? 0.7 : 0.58) + active * (index === 0 ? 0.36 : 0.28);

    computer.style.opacity = active <= 0 || active >= 1 ? "0" : index === 0 ? "0.88" : "0.72";
    computer.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${rotate}deg) scale(${scale})`;
  });
}

function setSkyScroll() {
  if (!skyWord) return;
  const rect = skyWord.parentElement.getBoundingClientRect();
  const drift = Math.round((window.innerHeight - rect.top) * 0.18);
  skyWord.style.backgroundPosition = `calc(50% + ${drift}px) calc(50% + ${drift * 0.45}px)`;
  skyWord.style.transform = `translateX(${Math.sin(drift / 160) * 3}vw)`;
}

function setSectionComment() {
  if (!brandBubble) return;
  const viewportAnchor = window.innerHeight * 0.42;
  let activeText = sectionComments[0].text;

  sectionComments.forEach((item) => {
    const section = document.querySelector(item.selector);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportAnchor && rect.bottom >= viewportAnchor) {
      activeText = item.text;
    }
  });

  if (brandBubble.textContent !== activeText) {
    brandBubble.textContent = activeText;
  }
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

ghostLabs.forEach((ghostLab) => {
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
updateScrollEffects();
