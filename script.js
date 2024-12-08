const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    
    showLoading(true);
    try {
        const results = await searchTidal(query);
        if (results.length === 0) {
            displayError("No results found.");
        } else {
            displayResults(results);
        }
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
});

async function searchTidal(query) {
    try {
        const url = `${API_BASE}/search/?s=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        throw new Error("Failed to fetch search results. Please try again later.");
    }
}

async function fetchTrack(id, quality) {
    try {
        const url = `${API_BASE}/track/?id=${id}&quality=${quality}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch track. Please try again later.");
    }
}

async function fetchCover(id, query) {
    try {
        const url = id ? `${API_BASE}/cover/?id=${id}` : `${API_BASE}/cover/?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch cover. Please try again later.");
    }
}

async function fetchSong(query, quality) {
    try {
        const url = `${API_BASE}/song/?q=${encodeURIComponent(query)}&quality=${quality}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch song. Please try again later.");
    }
}

async function fetchAlbum(id) {
    try {
        const url = `${API_BASE}/album/?id=${id}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch album. Please try again later.");
    }
}

async function fetchPlaylist(id) {
    try {
        const url = `${API_BASE}/playlist/?id=${id}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch playlist. Please try again later.");
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

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