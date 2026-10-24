const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub");
const searchStatus = document.querySelector("#searchStatus");
const params = new URLSearchParams(location.search);

const initialQuery = params.get("q")?.trim() ?? "";
movieInput.value = initialQuery;

movieForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = movieInput.value.trim();
    if (!query) {
        movieInput.focus();
        return;
    }

    location.href = `search-results.html?q=${encodeURIComponent(query)}`;
});

if (initialQuery) {
    searchMovies(initialQuery);
} else {
    searchStatus.textContent = "Enter a movie title to get started.";
}

async function searchMovies(movieName) {
    searchStatus.textContent = "Searching movies...";
    movieHub.replaceChildren();

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=4bec4c3c&s=${encodeURIComponent(movieName)}`);
        if (!response.ok) {
            throw new Error(`Movie search failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.Response === "True") {
            displayMovies(data.Search, movieName);
            searchStatus.textContent = `${data.totalResults} results for "${movieName}"`;
        } else {
            searchStatus.textContent = data.Error || "No movies found. Try another title.";
        }
    } catch (error) {
        console.error("Unable to search movies:", error);
        searchStatus.textContent = "Unable to search right now. Please try again.";
    }
}

function displayMovies(movies, query) {
    movieHub.replaceChildren();

    movies.forEach((movie, index) => {
        const card = document.createElement("a");
        card.href = `movie-detail.html?id=${encodeURIComponent(movie.imdbID)}&q=${encodeURIComponent(query)}`;
        card.className = "result-card group overflow-hidden rounded-xl border border-white/10 bg-[#151515] text-left transition duration-200 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-950/20 focus:outline-none focus:ring-2 focus:ring-red-500";
        card.style.setProperty("--card-index", String(index));
        card.setAttribute("aria-label", `View ${movie.Title}, ${movie.Year}`);

        const poster = document.createElement("img");
        if (movie.Poster !== "N/A") {
            poster.src = movie.Poster;
        }
        poster.alt = `${movie.Title} poster`;
        poster.className = "aspect-[2/3] w-full bg-[#202020] object-cover transition duration-300 group-hover:scale-[1.03]";
        poster.loading = "lazy";

        const details = document.createElement("span");
        details.className = "block p-3";

        const title = document.createElement("span");
        title.className = "block truncate font-semibold text-white";
        title.textContent = movie.Title;

        const year = document.createElement("span");
        year.className = "mt-1 block text-sm text-gray-400";
        year.textContent = movie.Year;

        details.append(title, year);
        card.append(poster, details);
        movieHub.append(card);
    });
}
