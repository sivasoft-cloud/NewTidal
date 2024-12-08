from flask import Flask, render_template
import os

app = Flask(__name__)

# Route to serve index.html for all requests
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT', 5000))