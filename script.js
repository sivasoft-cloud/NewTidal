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
    try {
        const response = await fetch(`${API_BASE}/search/?${type}=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
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
    try {
        const response = await fetch(`${API_BASE}/track/?id=${trackId}&quality=${quality}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Track details fetch failed:", error);
        throw new Error("Failed to fetch track details. Please try again later.");
    }
}

async function getCoverImage(id) {
    try {
        const response = await fetch(`${API_BASE}/cover/?id=${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()).url;
    } catch (error) {
        console.error("Cover image fetch failed:", error);
        throw new Error("Failed to fetch cover image. Please try again later.");
    }
}

async function getAlbumDetails(albumId) {
    try {
        const response = await fetch(`${API_BASE}/album/?id=${albumId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Album details fetch failed:", error);
        throw new Error("Failed to fetch album details. Please try again later.");
    }
}

// (The rest of your code remains the same as provided)