const movieDetail = document.querySelector("#movie-detail");
const movieBackdrop = document.querySelector("#movie-backdrop");
const backToSearch = document.querySelector("#backToSearch");

const params = new URLSearchParams(location.search);
const imdbID = params.get("id")?.trim();
const searchQuery = params.get("q")?.trim();

if (searchQuery) {
    backToSearch.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
}

backToSearch.addEventListener("click", (event) => {
    const previousPage = new URL(document.referrer || location.href);
    if (previousPage.origin === location.origin && previousPage.pathname.endsWith("/search-results.html")) {
        event.preventDefault();
        history.back();
    }
});

if (imdbID) {
    searchMovie(imdbID);
} else {
    showMessage("No movie was selected. Return to search and choose a movie.");
}

async function searchMovie(movieId) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=4bec4c3c&i=${encodeURIComponent(movieId)}&plot=full`);
        if (!response.ok) {
            throw new Error(`Movie details request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.Response === "True") {
            displayMovie(data);
        } else {
            showMessage(data.Error || "Movie details could not be found.");
        }
    } catch (error) {
        console.error("Unable to load movie details:", error);
        showMessage("Unable to load movie details right now. Please try again.");
    }
}

function showMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "rounded-xl border border-white/10 bg-black/50 p-5 text-gray-300";
    paragraph.textContent = message;
    movieDetail.replaceChildren(paragraph);
}

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text || "N/A";
    return element;
}

function createMetadataBadge(text, isRating = false) {
    const badge = createTextElement(
        "span",
        isRating
            ? "inline-flex rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-black"
            : "inline-flex rounded-full border border-emerald-400/50 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-300",
        text
    );
    return badge;
}

function createCredit(label, value) {
    const section = document.createElement("section");
    section.className = "border-b border-white/15 py-3";
    section.append(
        createTextElement("h3", "mb-1 text-xs font-bold uppercase tracking-[.2em] text-rose-500", label),
        createTextElement("p", "text-sm leading-relaxed text-gray-100 sm:text-base", value)
    );
    return section;
}

function displayMovie(data) {
    document.title = `MovieHub | ${data.Title}`;
    movieDetail.className = "mx-auto flex min-h-[calc(100svh-60px)] max-w-7xl items-center px-5 py-10 sm:px-8";
    movieBackdrop.replaceChildren();

    if (data.Poster && data.Poster !== "N/A") {
        const backdrop = document.createElement("img");
        backdrop.src = data.Poster;
        backdrop.alt = "";
        backdrop.className = "absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl";
        movieBackdrop.append(backdrop);
    }
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-gradient-to-r from-[#080a0a]/95 via-[#080a0a]/85 to-[#080a0a]/75";
    movieBackdrop.append(overlay);

    const layout = document.createElement("article");
    layout.className = "detail-enter grid w-full items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10";

    const posterContainer = document.createElement("div");
    posterContainer.className = "mx-auto w-full max-w-[250px]";

    const poster = document.createElement("img");
    if (data.Poster && data.Poster !== "N/A") {
        poster.src = data.Poster;
    }
    poster.alt = `${data.Title} movie poster`;
    poster.className = "w-full rounded-xl border border-red-500/25 bg-[#171717] object-cover shadow-2xl shadow-red-950/30";
    poster.loading = "eager";
    posterContainer.append(poster);

    const details = document.createElement("div");
    details.className = "min-w-0";
    details.appendChild(createTextElement("h1", "text-4xl font-extrabold tracking-tight text-white sm:text-5xl", data.Title));

    const metadata = document.createElement("div");
    metadata.className = "mt-5 flex flex-wrap gap-2";
    metadata.append(
        createMetadataBadge(data.Released),
        createMetadataBadge(data.Rated),
        createMetadataBadge(data.Runtime),
        createMetadataBadge(data.Genre),
        createMetadataBadge(`IMDb ${data.imdbRating}/10`, true)
    );
    details.append(metadata);
    details.appendChild(createTextElement("h2", "mb-2 mt-7 text-xs font-bold uppercase tracking-[.25em] text-rose-500", "Plot overview"));
    details.appendChild(createTextElement("p", "text-sm leading-7 text-gray-200 sm:text-base", data.Plot));

    const credits = document.createElement("div");
    credits.className = "mt-4 grid gap-x-8 sm:grid-cols-2";
    credits.append(
        createCredit("Director", data.Director),
        createCredit("Writer", data.Writer),
        createCredit("Actors", data.Actors),
        createCredit("Language", data.Language),
        createCredit("Country", data.Country)
    );
    details.appendChild(credits);

    const imdbLink = document.createElement("a");
    imdbLink.href = `https://www.imdb.com/title/${encodeURIComponent(data.imdbID)}/`;
    imdbLink.target = "_blank";
    imdbLink.rel = "noopener noreferrer";
    imdbLink.className = "mt-6 inline-flex rounded-lg bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-[#080808]";
    imdbLink.textContent = "View on IMDb";
    details.appendChild(imdbLink);

    layout.append(posterContainer, details);
    movieDetail.replaceChildren(layout);
}
