from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Base URL for the Tidal API
API_BASE = "https://tidal.401658.xyz"

# CORS Proxy to bypass CORS issues
CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    search_type = request.args.get('type', 's')  # Default to 'song'
    quality = request.args.get('quality', 'HI_RES')  # Default to 'Hi-Res'

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        # Construct the Tidal API request URL with CORS proxy
        url = f"{CORS_PROXY}{API_BASE}/search/?{search_type}={query}&quality={quality}"
        response = requests.get(url, headers={'Accept': 'application/json'})
        response.raise_for_status()  # Check if request was successful

        # Parse and return the JSON response
        data = response.json()
        if 'items' in data:
            return jsonify(data['items'])
        else:
            return jsonify({"error": "Invalid response format"}), 500

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)