// ICT251 Activity 3: interactive features for the personal portfolio.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 1. Mobile navigation
const toggle = $(".menu-toggle");
const nav = $(".nav-links");
if (toggle && nav) {
    toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }));
}

// 2. Theme switch
const themeToggle = $("#themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const light = document.body.classList.toggle("light-theme");
        themeToggle.setAttribute("aria-pressed", String(light));
        themeToggle.textContent = light ? "☀️ Light" : "🌙 Dark";
    });
}

// 3. Project search/filter + reset
const search = $("#projectSearch");
const reset = $("#resetProjects");
const status = $("#projectStatus");
const cards = $$(".project-card");

function filterProjects() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
        const matches = card.dataset.search.toLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) shown++;
    });
    status.textContent = query
        ? (shown ? `${shown} project${shown === 1 ? "" : "s"} match "${query}".` : `No projects match "${query}". Try another search or Reset.`)
        : "Showing all projects.";
}
if (search) search.addEventListener("input", filterProjects);
if (reset) reset.addEventListener("click", () => { search.value = ""; filterProjects(); search.focus(); });

// Expandable project details
$$(".details-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const details = button.nextElementSibling;
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        button.textContent = expanded ? "Show details" : "Hide details";
        details.hidden = expanded;
    });
});

// 4. Gallery viewer
const galleryFigures = $$(".gallery figure");
let currentPhoto = 0;
function updateGallery() {
    galleryFigures.forEach((figure, index) => figure.hidden = index !== currentPhoto);
    const counter = $("#galleryStatus");
    if (counter) counter.textContent = `Photo ${currentPhoto + 1} of ${galleryFigures.length}`;
}
$("#previousPhoto")?.addEventListener("click", () => {
    currentPhoto = (currentPhoto - 1 + galleryFigures.length) % galleryFigures.length;
    updateGallery();
});
$("#nextPhoto")?.addEventListener("click", () => {
    currentPhoto = (currentPhoto + 1) % galleryFigures.length;
    updateGallery();
});
updateGallery();

// Compulsory contact form validation and local preview
const form = $("#contactForm");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = $("#name");
        const email = $("#email");
        const message = $("#message");
        const feedback = $("#formMessage");
        const preview = $("#formPreview");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        name.setCustomValidity("");
        email.setCustomValidity("");
        message.setCustomValidity("");

        if (!name.value.trim()) name.setCustomValidity("Please enter your name.");
        if (!message.value.trim()) message.setCustomValidity("Please enter a message.");
        if (!emailPattern.test(email.value.trim())) email.setCustomValidity("Please enter a valid email address.");

        if (!form.checkValidity()) {
            form.reportValidity();
            feedback.textContent = "Please correct the highlighted fields.";
            preview.hidden = true;
            return;
        }

        feedback.textContent = "Validated successfully. No message was sent.";
        preview.textContent = `Validated contact preview: ${name.value.trim()} (${email.value.trim()}) selected "${$("#topic").value}".`;
        preview.hidden = false;
    });
}
