from openai import OpenAI
# from api_keys_file import open_api_key2
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
# print("hello from llm_backend")
load_dotenv()
print("test commit")

# Use environment variables
open_api_key2 = os.getenv('OPEN_API_KEY')
client = OpenAI(api_key=open_api_key2)

# @app.route("/api/greeting", methods=["GET"])
# def test_function():
#   geeting = "hello"
#   return geeting

# this is just a dummy function to check cross container communication
@app.route("/api/greeting", methods=["GET"])
def get_greeting():
  greeting = "hello"
  return jsonify({"greeting": greeting})

@app.route('/api/analyze_hate_speech', methods=['POST'])
def analyze_hate_speech():
    system_message = """You are an AI trained to detect hate speech or any kind of offensive language
                        and respond with counter-speech. 
                        If no hate speech is detected,
                        respond with 'No hate speech detected.'"""
    
    system_message2 = """You are a humorous AI trained to detect hate speech or any kind of offensive language
                        and respond with counter-speech.
                        If no hate speech is detected,
                        respond with 'No hate speech detected.'"""

    try:
        data = request.json
        user_message = data.get('text', '')

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            # stream=True
        )

        analysis_result = response.choices[0].message.content.strip()
        print("analysis result: ", analysis_result)
        return jsonify({"analysis_result": analysis_result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=6001)