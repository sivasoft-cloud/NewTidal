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

async function searchTidal(query, type = 's', quality = 'HI_RES') {
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
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
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
            <p>Artist: ${item.artist?.name || 'N/A'}</p>
            <p>Duration: ${formatDuration(item.duration)}</p>
            <p>Quality: ${item.audioQuality || 'N/A'}</p>
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

function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function displayError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}