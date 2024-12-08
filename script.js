const API_BASE = "https://tidal.401658.xyz";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('searchQuery').value;
        const type = document.getElementById('searchType').value;
        const quality = document.getElementById('searchQuality').value;

        showLoading(true);
        try {
            const results = await searchTidal(query, type, quality);
            displayResults(results, type);
        } catch (error) {
            displayError(error.message);
        } finally {
            showLoading(false);
        }
    });
} else {
    console.error('Search form not found');
}

async function searchTidal(query, type = 's', quality = 'HI_RES') {
    try {
        const url = `${CORS_PROXY}${API_BASE}/search/?${type}=${encodeURIComponent(query)}&quality=${quality}`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.items)) {
            throw new Error("Invalid response format");
        }
        return data.items;
    } catch (error) {
        console.error("Search failed:", error);
        throw new Error("Failed to fetch search results. Please try again later.");
    }
}

function displayResults(results, type) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        let content = `
            <h2>${item.title || item.name}</h2>
        `;

        if (type === 's') {
            content += `
                <p>Artist: ${item.artist?.name || 'N/A'}</p>
                <p>Album: ${item.album?.title || 'N/A'}</p>
                <p>Duration: ${formatDuration(item.duration)}</p>
                <p>Quality: ${item.audioQuality || 'N/A'}</p>
                ${item.explicit ? '<p class="explicit">Explicit</p>' : ''}
            `;
        } else if (type === 'a') {
            content += '<p>Artist</p>';
        } else if (type === 'al') {
            content += `<p>Album by ${item.artist?.name || 'N/A'}</p>`;
        } else if (type === 'v') {
            content += '<p>Video</p>';
        } else if (type === 'p') {
            content += '<p>Playlist</p>';
        }

        content += `<button onclick="viewDetails('${type}', ${item.id})">View Details</button>`;

        resultItem.innerHTML = content;
        resultsContainer.appendChild(resultItem);
    });
}

function showLoading(show) {
    const loadingIndicator = document.querySelector('.loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'inline-block' : 'none';
    } else {
        console.error('Loading indicator not found');
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        console.error('Error container not found');
    }
}

function viewDetails(type, id) {
    // Implementation to show details based on type and id
}