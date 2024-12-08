// Define the API base URL
const API_BASE = "https://tidal.401658.xyz";

// Handle the search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const query = document.getElementById('search-query').value;

    document.getElementById('loading').style.display = 'inline-block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('results').innerHTML = '';

    // Fetch search results from the API
    fetch(`${API_BASE}/search/?s=${query}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            if (data.error) {
                document.getElementById('error').textContent = data.error;
                document.getElementById('error').style.display = 'block';
            } else {
                displayResults(data.results);
            }
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').textContent = 'An error occurred while fetching data.';
            document.getElementById('error').style.display = 'block';
        });
});

// Display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h2>${result.title}</h2>
            <p>${result.description}</p>
            <button onclick="showDetails('${result.id}')">View Details</button>
        `;
        resultsContainer.appendChild(resultItem);
    });
}

// Show detailed view of a selected song
function showDetails(id) {
    fetch(`${API_BASE}/song/?q=${id}&quality=HI_RES`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('error').textContent = data.error;
                document.getElementById('error').style.display = 'block';
            } else {
                const detailView = document.createElement('div');
                detailView.classList.add('detail-view');
                detailView.innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.artist}</p>
                    <p>${data.album}</p>
                    <p>Quality: ${data.quality}</p>
                    <img src="${data.cover}" alt="${data.title}">
                    <audio controls>
                        <source src="${data.url}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                `;
                document.getElementById('results').innerHTML = '';
                document.getElementById('results').appendChild(detailView);
            }
        })
        .catch(error => {
            document.getElementById('error').textContent = 'An error occurred while fetching details.';
            document.getElementById('error').style.display = 'block';
        });
}
