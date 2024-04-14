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


        



# @app.route('/api/analyze_text', methods=['POST'])
# def analyze_text():
#     try:
#         data = request.json
#         text = data.get('text', '')

#         if not text:
#             return jsonify({"error": "No text provided"}), 400


#         analysis_result, error = analyze_hate_speech(text)
#         print("Analysis result:", analysis_result)

#         if error:
#             print("Error during text analysis: ", error)
#             return jsonify({"error": error}), 500

#         if "No hate speech detected." in analysis_result:
#             return jsonify({"message": "No hate speech detected."})
#         else:
#             return jsonify({"counterSpeech": analysis_result})

#     except Exception as e:
#         print("Error during text analysis:", str(e))
#         return jsonify({"error": str(e)}), 500

def analyze_hate_speech(text):
  system_message = """You are an AI trained to detect hate speech and respond with counter-speech. 
                        If no hate speech is detected,
                        respond with 'No hate speech detected.'"""


  user_message = text
  try:
    response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
      ],
      # stream=True
    )

    analysis_result = response.choices[0].message.content.strip()
    # response endpoint changed
    # refer to -> https://stackoverflow.com/questions/77444332/openai-python-package-error-chatcompletion-object-is-not-subscriptable
    # response_message = response.choices[0].message.content
    return analysis_result, None
  except Exception as e:
    return None, str(e)

def fetch_hate_speech_analysis(text):
    url = "http://openai_backend:6000/api/analyze_hate_speech"
    try:
        response = requests.post(url, json={"text": text})
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Failed to analyze text with backend service"}
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

@app.route('/api/analyze_text', methods=['POST'])
def analyze_text():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Call the llm_backend API
        response = requests.post("http://openai_backend:6000/api/analyze_hate_speech", json={"text": text})
        if response.status_code == 200:
            analysis_result = response.json().get('analysis_result', '')
            if "No hate speech detected." in analysis_result:
                return jsonify({"message": "No hate speech detected."})
            else:
                return jsonify({"counterSpeech": analysis_result})
        else:
            return jsonify({"error": "Failed to analyze text"}), 500

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
        print("Text sent to the filter:", text)
        
        # Make a POST request to another route to filter the text
        filter_response = requests.post('http://filter:7000/api/test', json={'text': text})
        
        # Check if the request was successful
        if filter_response.status_code == 200:
            response = filter_response.json().get('filtered_text')
            return jsonify({"filtered_text": response})
        else:
            return jsonify({"error": "Failed to filter text"}), 500

    except Exception as e:
        print("Error during text filtering:", str(e))
        return jsonify({"error": str(e)}), 500

# @app.route('/api/filter', methods=['POST'])
# def filter_text():
#     data = request.get_json()
#     text = data.get('text', '')
#     if not text:
#         return jsonify({"error": "No text provided"}), 400
#     response = generate_response(text)  # Assuming generate_response is defined
#     return jsonify({"filtered_text": response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
