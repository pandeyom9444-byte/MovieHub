const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const menuButton = document.querySelector("#menuButton");
const mainMenu = document.querySelector("#mainMenu");

movieForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = movieInput.value.trim();
    if (!query) {
        movieInput.focus();
        return;
    }

    location.href = `search-results.html?q=${encodeURIComponent(query)}`;
});

menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    mainMenu.classList.toggle("hidden", isExpanded);
});

mainMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        mainMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
});
