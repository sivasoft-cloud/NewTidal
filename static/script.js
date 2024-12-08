// /static/script.js
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(searchForm);
            const data = {
                searchQuery: formData.get('searchQuery'),
                searchType: formData.get('searchType'),
                searchQuality: formData.get('searchQuality')
            };

            showLoading(true);
            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const results = await response.json();
                displayResults(results, formData.get('searchType'));
            } catch (error) {
                displayError(error.message);
            } finally {
                showLoading(false);
            }
        });
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
                <p>Album: ${item.album?.title || 'N/A'}</p>
                <p>Duration: ${item.duration}</p>
                <p>Quality: ${item.audioQuality || 'N/A'}</p>
                ${item.explicit ? '<p class="explicit">Explicit</p>' : ''}
                <button onclick="viewDetails('${type}', ${item.id})">View Details</button>
            `;

            resultItem.innerHTML = content;
            resultsContainer.appendChild(resultItem);
        });
    }
});