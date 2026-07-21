const envelope = document.querySelector('#envelope');
const sparkles = document.querySelector('#sparkles');
const detailsButton = document.querySelector('#detailsButton');
const detailsDialog = document.querySelector('#detailsDialog');
const closeDetails = document.querySelector('#closeDetails');
const fullscreenButton = document.querySelector('#fullscreenButton');
const musicButton = document.querySelector('#musicButton');
const music = document.querySelector('#music');

let opened = false;

function setMusicState(isPlaying) {
  musicButton.classList.toggle('is-playing', isPlaying);
  musicButton.setAttribute('aria-label', isPlaying ? 'توقف موسیقی' : 'پخش موسیقی');
}

function openInvitation() {
  if (opened) return;
  opened = true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  envelope.classList.add(reducedMotion ? 'is-open' : 'is-opening');
  envelope.setAttribute('aria-expanded', 'true');
  envelope.setAttribute('aria-label', 'دعوت‌نامه باز شده');

  music.play()
    .then(() => setMusicState(true))
    .catch((error) => console.info('Music playback could not start.', error));

  if (!reducedMotion) {
    window.setTimeout(() => envelope.classList.add('is-card-visible'), 900);
    window.setTimeout(() => {
      envelope.classList.remove('is-card-visible');
      envelope.classList.add('is-lifting');
    }, 1500);
    window.setTimeout(() => {
      envelope.classList.remove('is-lifting');
      envelope.classList.add('is-front');
    }, 2900);
    window.setTimeout(() => {
      envelope.classList.remove('is-front');
      envelope.classList.add('is-rotating');
    }, 3300);
    window.setTimeout(() => {
      envelope.classList.remove('is-opening', 'is-card-visible', 'is-lifting', 'is-front', 'is-rotating');
      envelope.classList.add('is-open');
    }, 4300);
  }
}

envelope.addEventListener('click', openInvitation);

// Decorative lights. Change 28 to add or remove particles.
for (let i = 0; i < 28; i += 1) {
  const particle = document.createElement('i');
  particle.className = 'sparkle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  particle.style.setProperty('--size', `${2 + Math.random() * 5}px`);
  particle.style.setProperty('--duration', `${2.5 + Math.random() * 4}s`);
  particle.style.setProperty('--delay', `${Math.random() * 4}s`);
  sparkles.appendChild(particle);
}

detailsButton.addEventListener('click', () => detailsDialog.showModal());
closeDetails.addEventListener('click', () => detailsDialog.close());
detailsDialog.addEventListener('click', (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.info('Fullscreen is unavailable in this browser.', error);
  }
});

musicButton.addEventListener('click', async () => {
  if (music.paused) {
    await music.play();
    setMusicState(true);
  } else {
    music.pause();
    setMusicState(false);
  }
});

music.addEventListener('pause', () => setMusicState(false));
music.addEventListener('play', () => setMusicState(true));
