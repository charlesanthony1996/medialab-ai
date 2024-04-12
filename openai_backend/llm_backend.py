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
    print("analysis result: ", analysis_result)
    # response endpoint changed
    # refer to -> https://stackoverflow.com/questions/77444332/openai-python-package-error-chatcompletion-object-is-not-subscriptable
    # response_message = response.choices[0].message.content
    return analysis_result, None
  except Exception as e:
    return None, str(e)


@app.route('/analyze', methods=['POST'])
def analyze():
    print("before the result")
    text = request.json['text']
    result = analyze_hate_speech(text)  # This would be your actual analysis function
    print("analysze hate speech function worked")
    return jsonify(result)

@app.route('/api/analyze_hate_speech', methods=['POST'])
def analyze_hate_speech_endpoint():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400

    analysis_result, error = analyze_hate_speech(text)
    if error:
        return jsonify({"error": error}), 500

    return jsonify({"analysis_result": analysis_result})


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=6000)