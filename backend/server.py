from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
import openai
from api_keys_file import open_api_key2
from twitterRoberta import generate_response
from llm_backend import analyze_hate_speech

openai.api_key = open_api_key2

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# this is just a dummy route
# to get a dummy message from the backend
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "This is the data from Flask."}
    return jsonify(data)

# just a route for testing
# hooks to the get comments button on hatespeech.vue
@app.route('/api/comments', methods=['GET'])
def get_comments():
    data = {"comment": "first comment"}
    return jsonify(data)

# just another dummy route
# no use of this to the frontend right not
@app.route("/extension/default", methods=["GET"])
def get_default_extension():
    data = { "prompt": "Highlighted"}
    return jsonify(data)

# route thats used to process the comments from the frontend
@app.route('/api/process_comments', methods=['GET'])
def process_comments():
    comments = request.json.get('comments', [])
    process_comments = []

    for comment in comments:
        processed_comments.append(comment)
    
    return jsonify({'processed comments: ', processed_comments})

# gpt 3.5 turbo respones is attached to this route from the frontend.
# refer to app.vue to the call from the frontend
# this should be moved to the llm backend.py
@app.route('/api/analyze_text', methods=['POST'])
def analyze_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400


        analysis_result, error = analyze_hate_speech(text)
        print("Analysis result:", analysis_result)

        if error:
            print("Error during text analysis: ", error)
            return jsonify({"error": error}), 500

        if "No hate speech detected." in analysis_result:
            return jsonify({"message": "No hate speech detected."})
        else:
            return jsonify({"counterSpeech": analysis_result})

    except Exception as e:
        print("Error during text analysis:", str(e))
        return jsonify({"error": str(e)}), 500


# New route to handle text filtering
@app.route('/api/filter', methods=['POST'])
def filter_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Call your TwitterRoberta implementation to generate response
        print("Text sent to the filter, " + text)
        response = generate_response(text)
        
        return jsonify({"filtered_text": response})

    except Exception as e:
        print("Error during text filtering:", str(e))
        return jsonify({"error": str(e)}), 500

