import os
from flask import Flask, request, Response
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return "AI Service is running."

# This will be the endpoint for the gateway to call
@app.route('/api/recommend', methods=['POST'])
def recommend():
    # In the future, this will trigger the RAG pipeline
    # For now, a simple streaming response
    def generate():
        yield "This is a streaming recommendation response.\n"
        yield "Based on your request, I recommend Card A.\n"
    
    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8081), debug=True)
