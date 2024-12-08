const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    const type = document.getElementById('searchType').value;
    const quality = document.getElementById('searchQuality').value;
    
    showLoading(true);
    try {
        let url;
        switch(type) {
            case 's':
                url = `${API_BASE}/search/?s=${encodeURIComponent(query)}`;
                break;
            case 'a':
                url = `${API_BASE}/search/?a=${encodeURIComponent(query)}`;
                break;
            case 'al':
                url = `${API_BASE}/search/?al=${encodeURIComponent(query)}`;
                break;
            case 'v':
                url = `${API_BASE}/search/?v=${encodeURIComponent(query)}`;
                break;
            case 'p':
                url = `${API_BASE}/search/?p=${encodeURIComponent(query)}`;
                break;
            default:
                throw new Error("Unsupported search type");
        }
        const results = await fetch(url).then(res => res.json());
        displayResults(results.items, type);
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
        } else if (type === 'a') {
            url = `${API_BASE}/search/?a=${encodeURIComponent(query)}`;
        } else if (type === 'al') {
            url = `${API_BASE}/search/?al=${encodeURIComponent(query)}`;
        } else if (type === 'v') {
            url = `${API_BASE}/search/?v=${encodeURIComponent(query)}`;
        } else if (type === 'p') {
            url = `${API_BASE}/search/?p=${encodeURIComponent(query)}`;
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

async function getTrackDetails(trackId, quality = 'HI_RES') {
    const response = await fetch(`${API_BASE}/track/?id=${trackId}&quality=${quality}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function getCoverImage(id) {
    const response = await fetch(`${API_BASE}/cover/?id=${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.url;
}

async function getAlbumDetails(albumId) {
    const response = await fetch(`${API_BASE}/album/?id=${albumId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function displayResults(results, type) {
    const resultsContainer = document.getElementById('results');
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

function formatDuration(duration) {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function viewDetails(type, id) {
    showLoading(true);
    try {
        let details;
        let coverUrl;

        if (type === 's') {
            details = await getTrackDetails(id);
            coverUrl = await getCoverImage(id);
        } else if (type === 'al') {
            details = await getAlbumDetails(id);
            coverUrl = await getCoverImage(id);
        } else {
            throw new Error(`Unsupported type: ${type}`);
        }

        displayDetailView(type, details, coverUrl);
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
}

function displayDetailView(type, details, coverUrl) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const detailView = document.createElement('div');
    detailView.className = 'detail-view';

    let content = `
        <h2>${details.title || details.name}</h2>
        ${coverUrl ? `<img src="${coverUrl}" alt="${details.title || details.name}" style="max-width: 300px; height: auto;">` : ''}
    `;

    if (type === 's') {
        content += `
            <p><strong>Artist:</strong> ${details.artist.name}</p>
            <p><strong>Album:</strong> ${details.album.title}</p>
            <p><strong>Duration:</strong> ${formatDuration(details.duration)}</p>
            <p><strong>Quality:</strong> ${details.audioQuality}</p>
            ${details.explicit ? '<p><strong>Explicit</strong></p>' : ''}
            <p><strong>Audio Modes:</strong> ${details.audioModes.join(', ')}</p>
        `;
    } else if (type === 'al') {
        content += `
            <p><strong>Artist:</strong> ${details.artist.name}</p>
            <p><strong>Release Date:</strong> ${details.releaseDate}</p>
            <p><strong>Number of Tracks:</strong> ${details.tracks.length}</p>
        `;
    }

    detailView.innerHTML = content;
    resultsContainer.appendChild(detailView);
}

function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function displayError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}