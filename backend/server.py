from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
import openai
from api_keys_file import open_api_key

openai.api_key = open_api_key

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "This is the data from Flask."}
    return jsonify(data)

@app.route('/api/comments', methods=['GET'])
def get_comments():
    data = {"comment": "first comment"}
    return jsonify(data)

@app.route("/extension/default", methods=["GET"])
def get_default_extension():
    data = { "prompt": "Highlighted"}
    return jsonify(data)

@app.route('/api/process_comments', methods=['GET'])
def process_comments():
    comments = request.json.get('comments', [])
    process_comments = []

    for comment in comments:
        processed_comments.append(comment)
    
    return jsonify({'processed comments: ', processed_comments})


@app.route('/api/analyze_text', methods=['POST'])
def analyze_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        system_message = "You are an AI trained to detect hate speech and respond with counter-speech if necessary. If no hate speech is detected, respond with 'No hate speech detected.'"
        user_message = text

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message },
                {"role": "user", "content": user_message }
            ]
        )

        analysis_result = response['choices'][0]['message']['content'].strip()
        print("Analysis result:", analysis_result)

        if "No hate speech detected." in analysis_result:
            return jsonify({"message": "No hate speech detected."})
        else:
            return jsonify({"counterSpeech": analysis_result})

    except Exception as e:
        print("Error during text analysis:", str(e))
        return jsonify({"error": str(e)}), 500


