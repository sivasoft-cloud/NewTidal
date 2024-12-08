const API_BASE = "https://tidal.401658.xyz";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchQueryInput = document.getElementById("searchQuery");
    const searchTypeSelect = document.getElementById("searchType");
    const searchQualitySelect = document.getElementById("searchQuality");
    const resultsContainer = document.getElementById("results");
    const loadingIndicator = document.getElementById("loading");

    // Function to handle search
    async function handleSearch(event) {
        event.preventDefault();

        const query = searchQueryInput.value.trim();
        const type = searchTypeSelect.value;
        const quality = searchQualitySelect.value;

        if (!query) {
            displayError("Please enter a search query.");
            return;
        }

        loadingIndicator.classList.remove("hidden");
        resultsContainer.innerHTML = "";

        try {
            const response = await fetch(
                `${CORS_PROXY}${API_BASE}/search?query=${encodeURIComponent(query)}&type=${type}&quality=${quality}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data. Please try again.");
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            displayError(error.message);
        } finally {
            loadingIndicator.classList.add("hidden");
        }
    }

    // Function to display search results
    function displayResults(data) {
        resultsContainer.innerHTML = "";

        if (data.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        data.forEach((item) => {
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("result-item");

            const title = item.title || "No Title Available";
            const artist = item.artist || "Unknown Artist";
            const album = item.album || "Unknown Album";
            const quality = item.quality || "Unknown Quality";

            resultDiv.innerHTML = `
                <h2>${title}</h2>
                <p><strong>Artist:</strong> ${artist}</p>
                <p><strong>Album:</strong> ${album}</p>
                <p><strong>Quality:</strong> ${quality}</p>
                <button onclick="playSong('${item.url}')">Play Song</button>
            `;

            resultsContainer.appendChild(resultDiv);
        });
    }

    // Function to handle errors
    function displayError(message) {
        resultsContainer.innerHTML = `<p class="error">${message}</p>`;
    }

    // Function to play a song
    window.playSong = (url) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            alert("No URL available for this song.");
        }
    };

    // Attach event listener
    searchForm.addEventListener("submit", handleSearch);
});