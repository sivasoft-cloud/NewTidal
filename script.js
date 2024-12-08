const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;

    showLoading(true);
    try {
        const results = await searchTidal(query, 's', 'HI_RES');
        displaySongResults(results);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
});

async function searchTidal(query, type = 's', quality = 'HI_RES') {
    try {
        let url;
        if (type === 's') {
            url = `${API_BASE}/search/?s=${encodeURIComponent(query)}`;
        } else {
            throw new Error("Unsupported search type");
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Search failed:", error);
        throw new Error("Failed to fetch search results. Please try again later.");
    }
}

function displaySongResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(song => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h2>${song.title}</h2>
            <p>Artist: ${song.artist.name}</p>
            <p>Album: ${song.album.title}</p>
            <p>Duration: ${formatDuration(song.duration)}</p>
            <p>Quality: ${song.audioQuality}</p>
            <p><a href="${song.url}" target="_blank">Listen on Tidal</a></p>
        `;
        resultsContainer.appendChild(resultItem);
    });
}

function formatDuration(duration) {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function displayError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}