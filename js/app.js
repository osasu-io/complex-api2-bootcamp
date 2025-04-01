document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("fetchBtn");
    button.addEventListener("click", fetchMovieAndActorBio);
});

async function fetchMovieAndActorBio() {
    const movieTitle = document.getElementById("movieInput").value;
    const apiKey = "e8a9635d1120c3ec8483cae6120b6d14"; // TMDB API key

    try {
        // Step 1: Search for the movie
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`);
        const searchData = await searchRes.json();
        if (!searchData.results.length) throw new Error("Movie not found.");

        const movieId = searchData.results[0].id;
        document.getElementById("movieTitle").textContent = searchData.results[0].title;

        // Step 2: Fetch credits
        const creditRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        const creditData = await creditRes.json();
        const firstActor = creditData.cast[0];

        document.getElementById("actorName").textContent = firstActor.name;
        document.getElementById("actorImage").src = `https://image.tmdb.org/t/p/w200${firstActor.profile_path || ""}`;
        document.getElementById("actorImage").alt = firstActor.name;

        // Step 3: Fetch Wikipedia summary
        const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstActor.name)}`);
        const wikiData = await wikiRes.json();

        if (wikiData.extract) {
            document.getElementById("actorBio").textContent = wikiData.extract;
        } else {
            document.getElementById("actorBio").textContent = "No bio found on Wikipedia.";
        }

    } catch (err) {
        console.error(err);
        alert("Something went wrong while fetching data.");
    }
}
