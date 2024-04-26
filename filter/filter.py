import torch
import transformers
import numpy as np
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import json
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS

class TextProcessor:
    def __init__(self, config_path):
        with open('config.path', 'r') as config_file:
            config = json.load(config_file)

        self.active_config = config["models"][config["active_model"]]
        self.model = TFAutoModelForSequenceClassification.from_pretrained(self.active_config["model_path"])
        self.tokenizer = AutoTokenizer.from_pretrained(active_config["model_path"])
        self.threshold = self.active_config["threshold"]


    def preprocess(self, text):
        if self.active_config["preprocess"]["lower_case"]:
            text = text.lower()

        if self.active_config["preprocess"]["remove_punctuation"]:
            text = ''.join(char for char in text.isalnum() or char.isspace())
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
cors = CORS(app, resources={r"/api/*" : { "origins: "*"" }})
processor = TextProcessor('config.json')





