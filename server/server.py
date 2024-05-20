from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os
import openai
import requests
from cachetools import cached, LRUCache

# Load environment variables
load_dotenv()

# Example Change for Submodules Tutorial
a = 1

# Setup Flask application
app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# OpenAI API Key
open_api_key = os.getenv('OPEN_API_KEY')
client = openai.Client(api_key=open_api_key)

cache = LRUCache(maxsize=100)

@app.route('/api/data', methods=['GET'])
# @cached(cache)
def get_data():
    return jsonify({"message": "This is the data from Flask."})

# dummy function
# @cached(cache)
def fetch_greeting():
    # response = requests.get("http://openai_backend:6001/api/greeting")
    response = requests.get("http://localhost:6001/api/greeting")
    if response.status_code == 200:
        data = response.json()
        return data["greeting"]
    else:
        return "Failed to fetch greeting"

@app.route("/api/show_greeting", methods=["GET"])
# @cached(cache)
def show_greeting():
    greeting = fetch_greeting()
    return jsonify({"server_greeting": greeting})

@app.route('/api/comments', methods=['GET'])
# @cached(cache)
def get_comments():
    return jsonify({"comment": "first comment"})

@app.route("/extension/default", methods=["GET"])
# @cached(cache)
def get_default_extension():
    return jsonify({"prompt": "Highlighted"})


@app.route('/api/process_comments', methods=['POST'])
# @cached(cache)
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
        # filter_response = requests.post('http://filter:7001/api/test', json={'text': response_comment})
        # charles running things locally -> what run_services.sh file is all about. dont delete
        filter_response = requests.post('http://localhost:7001/api/test', json={'text': response_comment})
        
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
# @cached(cache)
def filter_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Attempt to filter the text
        try:
            # filter_response = requests.post('http://filter:7001/api/test', json={'text': text})
            filter_response = requests.post('http://localhost:7001/api/test', json={'text': text})
            if filter_response.status_code == 200:
                text = filter_response.json().get('filtered_text', text)
        except Exception as e:
            print("Filter service failed, using original text:", str(e))
            # If filtering fails, use the original text for analysis
            pass

        # Analyze the text (either filtered or original) for hate speech
        # responseFromLLM = requests.post("http://openai_backend:6001/api/analyze_hate_speech", json={"text": text})
        responseFromLLM = requests.post("http://localhost:6001/api/analyze_hate_speech", json={"text": text})
        analysis_result = responseFromLLM.json().get('analysis_result', '')
        return jsonify({"filtered_text": analysis_result})

    except Exception as e:
        print("Error during text filtering or analysis:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate_counter_speech", methods=["POST"])
def generate_counter_speech():
    try:
        data = request.get_json()
        user_message = data.get("text", "")

        if not user_message:
            return jsonify({"error": "No text provided"}), 400

        # Call the local LLM API to generate counter speech
        response = requests.post("http://localhost:6001/api/generate_counter_speech", json={"text": user_message})

        if response.status_code != 200:
            print(f"Error from LLM API: {response.text}")
            return jsonify({"error": "Failed to generate counter speech"}), response.status_code

        response_data = response.json()
        counter_speech_result = response_data.get("counter_speech_result", "No counter speech generated.")

        return jsonify({"counter_speech_result": counter_speech_result}), 200

    except Exception as e:
        print(f"Error during processing comments: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route("/api/explain_hate_speech", methods=["POST"])
def explain_comment():
    try:
        data = request.get_json()
        comment_text = data.get("text", "")

        if not comment_text:
            return jsonify({"error": "No text provided"}), 400

        # Call the local LLM API to explain the comment
        explanationFromLLM = requests.post("http://localhost:6001/api/explain_hate_speech", json={"text": comment_text})
        if explanationFromLLM.status_code != 200:
            print(f"Error from LLM API: {explanationFromLLM.text}")
            return jsonify({"error": "Failed to get explanation"}), explanationFromLLM.status_code
        
        explanation_result = explanationFromLLM.json().get("explanation_result", "")
        return jsonify({"explanation_text": explanation_result}), 200

    except Exception as e:
        print(f"Error during explaining comments: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/fake_function", methods=["POST"])
def fake_function():
    try:
        data = request.get_json()
        user_message = data.get("text", "")

        if not user_message:
            return jsonify({"error": "No text provided"}), 400

        # Call the LLM backend to simulate a response
        response = requests.post("http://localhost:6001/api/fake_response", json={"text": user_message})

        if response.status_code != 200:
            print(f"Error from LLM API: {response.text}")
            return jsonify({"error": "Failed to get fake response"}), response.status_code

        response_data = response.json()
        fake_response = response_data.get("fake_response", "No fake response generated.")

        return jsonify({"fake_response": fake_response}), 200

    except Exception as e:
        print(f"Error during processing fake function: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)