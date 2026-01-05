document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     FORCE START AT TOP
  =============================== */
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* ===============================
     SCROLL REVEAL
  =============================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  document
    .querySelectorAll(".scroll-reveal, .date-divider, .divider")
    .forEach(el => revealObserver.observe(el));

  /* ===============================
     POPUP ELEMENTS
  =============================== */
  const popup = document.getElementById("img-popup");
  const popupImg = document.getElementById("popup-img");
  const popupVideo = document.getElementById("popup-video");
  const closeBtn = popup.querySelector(".close");
  const leftArrow = popup.querySelector(".journal-arrow.left");
  const rightArrow = popup.querySelector(".journal-arrow.right");

  /* ===============================
     STATE
  =============================== */
  let popupMode = null; // "journal" | "project"
  let currentJournalIndex = -1;
  let currentProjectIndex = 0;
  let currentProjectImages = [];

  const journalImages = [...document.querySelectorAll(".journal-card img")];

  /* ===============================
     HELPERS
  =============================== */
  const showArrows = () => {
    leftArrow.style.display = "block";
    rightArrow.style.display = "block";
  };

  const hideArrows = () => {
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
  };

  function openPopupImage(src, isCertificate = false) {
    popup.classList.add("show");

    popupVideo.pause();
    popupVideo.src = "";
    popupVideo.style.display = "none";

    popupImg.src = src;
    popupImg.style.display = "block";
    popupImg.classList.toggle("certificate-popup", isCertificate);

    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    popup.classList.remove("show");

    popupImg.src = "";
    popupImg.style.display = "none";
    popupImg.classList.remove("certificate-popup");

    popupVideo.pause();
    popupVideo.src = "";
    popupVideo.style.display = "none";

    popupMode = null;
    currentJournalIndex = -1;
    currentProjectImages = [];
    currentProjectIndex = 0;

    hideArrows();
    document.body.style.overflow = "auto";
  }

  /* ===============================
     CLOSE HANDLERS
  =============================== */
  closeBtn.addEventListener("click", closePopup);

  popup.addEventListener("click", e => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && popup.classList.contains("show")) closePopup();
  });

  /* ===============================
     IMAGE POPUPS
  =============================== */
  document
    .querySelectorAll(".image-card img, .event-image img")
    .forEach(img => {
      img.addEventListener("click", () => {
        popupMode = null;
        hideArrows();
        openPopupImage(img.src);
      });
    });

  /* ===============================
     VIDEO POPUPS
  =============================== */
  document.querySelectorAll(".event-image video").forEach(video => {
    video.addEventListener("click", () => {
      popup.classList.add("show");

      popupImg.style.display = "none";
      popupVideo.src = video.src;
      popupVideo.style.display = "block";
      popupVideo.play();

      hideArrows();
      document.body.style.overflow = "hidden";
    });
  });

  /* ===============================
     JOURNAL POPUP
  =============================== */
  journalImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      popupMode = "journal";
      currentJournalIndex = index;
      openPopupImage(img.src);
      showArrows();
    });
  });

  /* ===============================
     PROJECT SLIDESHOW + POPUP
  =============================== */
  document.querySelectorAll(".project-slideshow").forEach(img => {
    const images = img.dataset.images.split(",");
    let index = 0;

    setInterval(() => {
      img.classList.add("is-fading");
      setTimeout(() => {
        index = (index + 1) % images.length;
        img.src = images[index];
        img.classList.remove("is-fading");
      }, 800);
    }, 3500);

    img.addEventListener("click", () => {
      popupMode = "project";
      currentProjectImages = images;
      currentProjectIndex = images.indexOf(img.src);
      openPopupImage(img.src);
      showArrows();
    });
  });

  /* ===============================
     ARROW NAVIGATION
  =============================== */
  const nextPage = () => {
    if (popupMode === "journal") {
      currentJournalIndex = (currentJournalIndex + 1) % journalImages.length;
      popupImg.src = journalImages[currentJournalIndex].src;
    }

    if (popupMode === "project") {
      currentProjectIndex = (currentProjectIndex + 1) % currentProjectImages.length;
      popupImg.src = currentProjectImages[currentProjectIndex];
    }
  };

  const prevPage = () => {
    if (popupMode === "journal") {
      currentJournalIndex =
        (currentJournalIndex - 1 + journalImages.length) % journalImages.length;
      popupImg.src = journalImages[currentJournalIndex].src;
    }

    if (popupMode === "project") {
      currentProjectIndex =
        (currentProjectIndex - 1 + currentProjectImages.length) %
        currentProjectImages.length;
      popupImg.src = currentProjectImages[currentProjectIndex];
    }
  };

  rightArrow.addEventListener("click", e => {
    e.stopPropagation();
    nextPage();
  });

  leftArrow.addEventListener("click", e => {
    e.stopPropagation();
    prevPage();
  });

  /* ===============================
     CERTIFICATE POPUP
  =============================== */
  document.querySelectorAll(".certificate-card img").forEach(img => {
    img.addEventListener("click", () => {
      popupMode = null;
      hideArrows();
      openPopupImage(img.src, true);
    });
  });

  /* ===============================
     CERTIFICATE 3D TILT
  =============================== */
  document.querySelectorAll(".certificate-card").forEach(card => {
    const strength = 40; // 10–18 recommended

    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * strength;
        const rotateX = -((y - centerY) / centerY) * strength;

        card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.04)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = `
            perspective(1200px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;
    });
});

/* ===============================
   HERO ROTATING TEXT (STABLE)
=============================== */
const glitchTitle = document.querySelector(".glitch");
const words = document.querySelectorAll(".dynamic-text .word");

let wordIndex = 0;
let animating = false;
const wordLetters = [];

const WORD_INTERVAL = 3200;
const LETTER_DELAY = 60;
const SWITCH_DELAY = 150;

// Split words into letters
words.forEach((word, i) => {
  const letters = [];
  const text = word.textContent.trim();
  word.textContent = "";

  [...text].forEach(char => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = char;
    word.appendChild(span);
    letters.push(span);
  });

  wordLetters.push(letters);

  if (i !== 0) {
    word.style.opacity = 0;
    word.style.visibility = "hidden";
  }
});

// Show first word
wordLetters[0]?.forEach(l => l.classList.add("in"));
if (words[0]) {
  words[0].style.opacity = 1;
  words[0].style.visibility = "visible";
}

// Rotation loop
setInterval(() => {
  if (animating || words.length < 2) return;
  animating = true;

  const currentLetters = wordLetters[wordIndex];
  const currentWord = words[wordIndex];

  const nextIndex = (wordIndex + 1) % words.length;
  const nextLetters = wordLetters[nextIndex];
  const nextWord = words[nextIndex];

  glitchTitle?.classList.add("glitch-active");

  // Animate out current word
  currentLetters.forEach((l, i) => {
    setTimeout(() => l.className = "letter out", i * LETTER_DELAY);
  });

  setTimeout(() => {
    currentWord.style.opacity = 0;
    currentWord.style.visibility = "hidden";

    nextLetters.forEach(l => l.className = "letter behind");
    nextWord.style.opacity = 1;
    nextWord.style.visibility = "visible";

    nextLetters.forEach((l, i) => {
      setTimeout(() => l.className = "letter in", i * LETTER_DELAY);
    });

    setTimeout(() => glitchTitle?.classList.remove("glitch-active"), 300);

    wordIndex = nextIndex;
    animating = false;

  }, currentLetters.length * LETTER_DELAY + SWITCH_DELAY);

}, WORD_INTERVAL);



});