from flask import Flask, render_template, request
import requests
import os

app = Flask(__name__)

# Route to serve index.html for all requests
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        query = request.form.get('searchQuery')
        search_type = request.form.get('searchType')
        search_quality = request.form.get('searchQuality')

        results = fetch_tidal_data(query, search_type, search_quality)
        return render_template('index.html', results=results)

    return render_template('index.html')

def fetch_tidal_data(query, search_type, search_quality):
    API_BASE = "https://tidal.401658.xyz"
    CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

    try:
        response = requests.get(f"{CORS_PROXY}{API_BASE}/search/?{search_type}={query}&quality={search_quality}", headers={'Accept': 'application/json'})
        response.raise_for_status()
        data = response.json()

        if not data or not isinstance(data.get('items'), list):
            raise ValueError("Invalid response format")

        return data['items']
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return []

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT', 5000))