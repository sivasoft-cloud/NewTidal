const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    
    showLoading(true);
    try {
        const results = await searchTidal(query, 's');
        displayResults(results);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
});

async function searchTidal(query, type = 's') {
    try {
        const url = `${API_BASE}/search/?s=${encodeURIComponent(query)}`;
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

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const content = `
            <h2>${item.title}</h2>
            <p>Artist: ${item.artist.name}</p>
            <p>Album: ${item.album.title}</p>
            <p>Duration: ${formatDuration(item.duration)}</p>
            <p>Quality: ${item.audioQuality}</p>
            ${item.explicit ? '<p class="explicit">Explicit</p>' : ''}
            <a href="${item.url}" target="_blank">Listen on Tidal</a>
        `;

        resultItem.innerHTML = content;
        resultsContainer.appendChild(resultItem);
    });
}

function formatDuration(duration) {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loading');
    if (show) {
        loadingIndicator.style.display = 'block';
    } else {
        loadingIndicator.style.display = 'none';
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}