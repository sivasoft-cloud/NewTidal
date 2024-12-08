document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    try {
        const response = await fetch(`https://tidal.401658.xyz/search/?s=${query}`);
        const data = await response.json();
        const tracks = data.items;

        tracks.forEach(track => {
            const listItem = document.createElement('li');
            listItem.textContent = `${track.title} by ${track.artist.name}`;
            
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', async () => {
                const downloadResponse = await fetch(`https://tidal.401658.xyz/song/?q=${track.title}&quality=HI_RES`);
                const downloadData = await downloadResponse.json();
                const downloadUrl = downloadData[2].OriginalTrackUrl;
                window.location.href = downloadUrl;
            });

            listItem.appendChild(downloadButton);
            resultsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});