def generate_response(input_text):
    
    return input_text

# If doing the docker for it, delete the upper generate_response function and remove
# The python multiline comment from below

"""
# Maybe not needed here: from flask import Flask, request, jsonify
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from scipy.special import softmax

# Load the model and tokenizer directly
tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")
loaded_model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")

# Define preprocess function
def preprocess(text):
    # You may need to customize this preprocess function based on how your model was trained
    return text

# Define a function to process each text
def process_text(text, threshold=0.3):
    # Preprocess the text
    text = preprocess(text)
    
    # Tokenize and encode the input text
    encoded_input = tokenizer(text, return_tensors='pt')
    
    # Feed input to the model
    output = loaded_model(**encoded_input)
    
    # Get scores
    scores = output.logits.detach().numpy()
    scores = softmax(scores)
    
    # Calculate the negativity score
    negativity_score = scores[0][0]  # Assuming binary classification
    
    # Print the text and negativity score
    print(f"All Texts: {text}")
    print(f"Negativity Score: {negativity_score:.4f}\n")
    
    # Check if the negativity score is higher than the threshold
    if negativity_score > threshold:
        return True, text, negativity_score
    else:
        return False, text, negativity_score

def generate_response(input_text):
    # Placeholder implementation, replace with actual logic
    
    
    #data = request.json
    #highlighted_text = data.get('text')
    
    highlighted_text = input

    # Process the text
    filtered, text, score = process_text(highlighted_text)
    if filtered:
        # Return the analyzed text and its negativity score
        return text
    else:
        return 'Is not HS'
    
"""