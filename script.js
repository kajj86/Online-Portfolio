document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       SCROLL REVEAL
    ================================ */
    const revealElements = document.querySelectorAll(
        ".scroll-reveal, .date-divider, .divider"
    );

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => revealObserver.observe(el));



    /* ================================
       POPUP BASE ELEMENTS
    ================================ */
    const popup = document.getElementById("img-popup");
    const popupImg = document.getElementById("popup-img");
    const popupVideo = document.getElementById("popup-video");
    const closeBtn = popup.querySelector(".close");

    const leftArrow = popup.querySelector(".journal-arrow.left");
    const rightArrow = popup.querySelector(".journal-arrow.right");

    let currentJournalIndex = -1;
    const journalImages = Array.from(
        document.querySelectorAll(".journal-card img")
    );



    /* ================================
       OPEN IMAGE (NORMAL)
    ================================ */
    document.querySelectorAll(".image-card img, .event-image img").forEach(img => {
        img.addEventListener("click", () => {
            openImage(img.src);
        });
    });



    /* ================================
       OPEN VIDEO
    ================================ */
    document.querySelectorAll(".event-image video").forEach(video => {
        video.addEventListener("click", () => {
            popup.classList.add("show");

            popupVideo.src = video.src;
            popupVideo.style.display = "block";
            popupVideo.play();

            popupImg.style.display = "none";
            popupImg.src = "";

            hideJournalArrows();
            document.body.style.overflow = "hidden";
        });
    });



    /* ================================
       JOURNAL CLICK → BOOK MODE
    ================================ */
    journalImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentJournalIndex = index;
            openJournalPage();
        });
    });



    /* ================================
       CERTIFICATE CLICK → FRAME MODE
    ================================ */
    document.querySelectorAll(".certificate-card img").forEach(img => {
        img.addEventListener("click", () => {
            popup.classList.add("show");

            popupImg.src = img.src;
            popupImg.style.display = "block";
            popupImg.classList.add("certificate-popup");

            popupVideo.style.display = "none";
            hideJournalArrows();

            document.body.style.overflow = "hidden";
        });
    });



    /* ================================
       JOURNAL NAVIGATION
    ================================ */
    function openJournalPage() {
        popup.classList.add("show");

        popupImg.src = journalImages[currentJournalIndex].src;
        popupImg.style.display = "block";
        popupImg.classList.remove("certificate-popup");

        popupVideo.style.display = "none";

        showJournalArrows();
        document.body.style.overflow = "hidden";
    }

    function nextJournalPage() {
        if (currentJournalIndex === -1) return;

        currentJournalIndex =
            (currentJournalIndex + 1) % journalImages.length;

        popupImg.src = journalImages[currentJournalIndex].src;
    }

    function prevJournalPage() {
        if (currentJournalIndex === -1) return;

        currentJournalIndex =
            (currentJournalIndex - 1 + journalImages.length) % journalImages.length;

        popupImg.src = journalImages[currentJournalIndex].src;
    }

    rightArrow.addEventListener("click", e => {
        e.stopPropagation();
        nextJournalPage();
    });

    leftArrow.addEventListener("click", e => {
        e.stopPropagation();
        prevJournalPage();
    });

    popupImg.addEventListener("click", nextJournalPage);



    /* ================================
       CLOSE POPUP
    ================================ */
    closeBtn.addEventListener("click", closePopup);

    popup.addEventListener("click", e => {
        if (e.target === popup) closePopup();
    });

    function closePopup() {
        popup.classList.remove("show");

        popupImg.src = "";
        popupImg.style.display = "none";
        popupImg.classList.remove("certificate-popup");

        popupVideo.pause();
        popupVideo.src = "";
        popupVideo.style.display = "none";

        hideJournalArrows();
        currentJournalIndex = -1;

        document.body.style.overflow = "auto";
    }



    /* ================================
       HELPERS
    ================================ */
    function openImage(src) {
        popup.classList.add("show");

        popupImg.src = src;
        popupImg.style.display = "block";
        popupImg.classList.remove("certificate-popup");

        popupVideo.style.display = "none";
        hideJournalArrows();

        document.body.style.overflow = "hidden";
    }

    function showJournalArrows() {
        leftArrow.style.display = "block";
        rightArrow.style.display = "block";
    }

    function hideJournalArrows() {
        leftArrow.style.display = "none";
        rightArrow.style.display = "none";
    }

    document.querySelectorAll(".certificate-card").forEach(card => {
    const strength = 75; // ⬅️ tilt intensity (lower = subtle)

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
            scale(1.05)
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

});
