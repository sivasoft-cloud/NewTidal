const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
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

async function fetchData(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API call failed:", error);
        throw new Error("Failed to fetch data. Please try again later.");
    }
}

async function searchTidal(query, type = 's', quality = 'HI_RES') {
    const url = `${API_BASE}/search/?${type}=${encodeURIComponent(query)}`;
    return await fetchData(url);
}

async function getTrackDetails(trackId, quality = 'HI_RES') {
    const url = `${API_BASE}/track/?id=${trackId}&quality=${quality}`;
    return await fetchData(url);
}

async function getCoverImage(id) {
    const data = await fetchData(`${API_BASE}/cover/?id=${id}`);
    return data.url;
}

async function getAlbumDetails(albumId) {
    const url = `${API_BASE}/album/?id=${albumId}`;
    return await fetchData(url);
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
            <p><strong>Number of Tracks:</strong> ${details.numberOfTracks}</p>
            <p><strong>Release Date:</strong> ${details.releaseDate}</p>
        `;
    }

    if (details.copyright) {
        content += `<p><strong>Copyright:</strong> ${details.copyright}</p>`;