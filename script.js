const API_BASE = "https://tidal.401658.xyz";

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;

    showLoading(true);
    try {
        const results = await searchTidal(query, 's', 'HI_RES');
        saveResultsToJSON(results);
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

function saveResultsToJSON(results) {
    const jsonData = JSON.stringify(results, null, 2); // Pretty print JSON with 2-space indentation
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function displayError(message) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}