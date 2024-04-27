import torch
import transformers
import numpy as np
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import json
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS
from scipy.special import softmax

class TextProcessor:
    def __init__(self, config_path):
        with open("config.json", 'r') as config_file:
            self.config = json.load(config_file)

        self.active_config = self.config["models"][self.config["active_model"]]
        self.model = TFAutoModelForSequenceClassification.from_pretrained(self.active_config["model_path"])
        self.tokenizer = AutoTokenizer.from_pretrained(self.active_config["model_path"])
        self.threshold = self.active_config["threshold"]


    def get_current_filter(self):
        return self.config["active_model"]


    def preprocess(self, text):
        if self.active_config["preprocess"]["lower_case"]:
            text = text.lower()

        if self.active_config["preprocess"]["remove_punctuation"]:
            text = ''.join(char for char in text if char.isalnum() or char.isspace())
        return text


    def process_text(self, text):
        text = self.preprocess(text)
        encoded_input = self.tokenizer(text, return_tensors='tf')
        output = self.model(encoded_input)
        logits = output.logits
        scores = tf.nn.softmax(logits, axis=-1).numpy()
        negativity_score = scores[0][0]
        return negativity_score > self.threshold, text, negativity_score


# end of class
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*" : { "origins": "*" }})
processor = TextProcessor('config.json')

def direct_test(sentence):
    filtered, processed_text , score = processor.process_text(sentence)
    print(f"Sentence: '{sentence}'\nFiltered: {filtered}\nNegativity Score: {score}\n")

@app.route("/api/test", methods=["POST"])
def filter_text():
    try:
        data = request.json
        text = data.get("text", '')

        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        fitered, processed_text , score = processor.process_text(text)
        if filtered:
            return jsonify({"filtered_text": processed_text, "negativity_score": score})
        else:
            return jsonify({"filtered_text": "Is not HS", "negativity_score": score})
    
    except Exception as e:
        return jsonify({"error": str((e))}), 500

        

if __name__ == "__main__":
    # get the current filter your running on json
    current_filter = processor.get_current_filter()
    print(f"Currently using filter: {current_filter}")
    direct_test("you are a very horrible person")
    app.run(debug=True, host='0.0.0.0', port = 7001)


