from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os
import openai
import requests

# Load environment variables
load_dotenv()

# Setup Flask application
app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# OpenAI API Key
open_api_key = os.getenv('OPEN_API_KEY')
client = openai.Client(api_key=open_api_key)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "This is the data from Flask."})

# dummy function
def fetch_greeting():
    response = requests.get("http://openai_backend:6000/api/greeting")
    if response.status_code == 200:
        data = response.json()
        return data["greeting"]
    else:
        return "Failed to fetch greeting"

@app.route("/api/show_greeting", methods=["GET"])
def show_greeting():
    greeting = fetch_greeting()
    return jsonify({"server_greeting": greeting})

@app.route('/api/comments', methods=['GET'])
def get_comments():
    return jsonify({"comment": "first comment"})

@app.route("/extension/default", methods=["GET"])
def get_default_extension():
    return jsonify({"prompt": "Highlighted"})


@app.route('/api/process_comments', methods=['POST'])
def process_comments():
    try:
        data = request.get_json()
        comment_text = data.get('comment', '')  # Assuming the key in JSON is 'comment'
        
        # Add a string to the comment text
        # comment_text += " added string here"
        
        # Process the comment here
        # For demonstration purposes, let's just echo back the modified comment
        response_comment = comment_text if comment_text else "No comment received"
        #response_comment = "backend boy"
        
        # Make a POST request to another route to filter the text
        filter_response = requests.post('http://filter:7000/api/test', json={'text': response_comment})
        
        # Check if the request was successful
        if filter_response.status_code == 200:
            response = filter_response.json().get('filtered_text')
            return jsonify({"comment": response}), 200
        else:
            return jsonify({"error": "Failed to filter text"}), 500
        
    except Exception as e:
        print("Error during processing comments:", str(e))
        return jsonify({'error': str(e)}), 500


# New route to handle text filtering
@app.route('/api/filter', methods=['POST'])
def filter_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Call your TwitterRoberta implementation to generate response
        print("Text sent to the filter:", text)
        
        # Make a POST request to another route to filter the text
        filter_response = requests.post('http://filter:7000/api/test', json={'text': text})
        
        # Check if the request was successful
        if filter_response.status_code == 200:
            response = filter_response.json().get('filtered_text')
            responseFromLLM = requests.post("http://openai_backend:6000/api/analyze_hate_speech", json={"text": response})
            analysis_result = responseFromLLM.json().get('analysis_result', '')
            return jsonify({"filtered_text": analysis_result})
        else:
            return jsonify({"error": "Failed to filter text"}), 500

    except Exception as e:
        print("Error during text filtering:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
