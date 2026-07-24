const openButton = document.getElementById("openInvitation");
const audio = document.getElementById("weddingAudio");
const audioToggle = document.getElementById("audioToggle");
const inviteContent = document.getElementById("inviteContent");
const timeline = document.querySelector(".timeline");
const revealItems = document.querySelectorAll(".reveal-on-scroll");
let timelineFrame = null;

const digitMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

audio.load();

function formatNumber(value, pad = 0) {
  return String(value)
    .padStart(pad, "0")
    .replace(/\d/g, (digit) => digitMap[Number(digit)]);
}

function updateCountdown() {
  const weddingDate = new Date("2026-08-14T19:00:00+03:30").getTime();
  const remaining = Math.max(0, weddingDate - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = formatNumber(days);
  document.getElementById("hours").textContent = formatNumber(hours, 2);
  document.getElementById("minutes").textContent = formatNumber(minutes, 2);
  document.getElementById("seconds").textContent = formatNumber(seconds, 2);
}

function setAudioButton() {
  audioToggle.textContent = audio.paused ? "\u266a" : "II";
  audioToggle.setAttribute("aria-label", audio.paused ? "پخش موسیقی" : "توقف موسیقی");
}

function updateTimelineProgress() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const viewportAnchor = window.innerHeight * 0.55;
  const progress = (viewportAnchor - rect.top) / rect.height;
  const clamped = Math.max(0, Math.min(1, progress));
  const lineInset = 14;
  const y = lineInset + clamped * (rect.height - lineInset * 2);
  timeline.style.setProperty("--progress-y", `${y}px`);
}

function requestTimelineProgress() {
  if (timelineFrame) return;
  timelineFrame = requestAnimationFrame(() => {
    timelineFrame = null;
    updateTimelineProgress();
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

revealItems.forEach((item) => revealObserver.observe(item));

openButton.addEventListener("click", async () => {
  document.body.classList.add("opened");
  try {
    await audio.play();
  } catch {
    audioToggle.textContent = "\u266a";
  }
  setAudioButton();
  setTimeout(() => inviteContent.scrollIntoView({ behavior: "smooth", block: "start" }), 1350);
});

audioToggle.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch {
      return;
    }
  } else {
    audio.pause();
  }
  setAudioButton();
});

updateCountdown();
updateTimelineProgress();
setInterval(updateCountdown, 1000);
window.addEventListener("scroll", requestTimelineProgress, { passive: true });
window.addEventListener("resize", requestTimelineProgress);
setAudioButton();
