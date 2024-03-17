# Setup
# What I installed for perspective to work in cmd inside a chosen folder
# 1. Open cmd
# 2. Create new environment inside your project folder (needed for perspective API for some reason)
# py -m venv myenv1
# 3. Activate it
# myenv1/Scripts/activate
# 4. pip.exe install google-api-python-client


# pip install huggingface_hub
# pip install datasets

# pip install openai
# pip install langchain
# pip install langchain-openai
# pip install chromadb
# pip install python-dotenv

# Paste this to the terminal to log in into huggingface to use the dataset:
# huggingface-cli login --token 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

# General imports
import pandas as pd
import csv
# Huggingface imports
from datasets import load_dataset
# Perspective API imports
from googleapiclient import discovery
import json
# For OpenAI part
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the dataset
dataset = load_dataset("ucberkeley-dlab/measuring-hate-speech")

# Get the 'train' split
train_dataset = dataset['train']

def saveDatasetAsCSV():
    # Convert the dataset to a pandas DataFrame
    df = pd.DataFrame(train_dataset)

    # Save the DataFrame as CSV
    df.to_csv('hate_speech_dataset.csv', index=False)

    print("Dataset saved as 'hate_speech_dataset.csv'")

def checkWhatsInsideOfTheDataset():
    # Access the 'text' field of each dictionary and print the first 10 texts
    for i, text in enumerate(df['text'][:10], start=1):
        print(f"{i}. {text}\n")

# saveDatasetAsCSV()
# checkWhatsInsideOfTheDataset()

# Load the CSV file from the local folder
df = pd.read_csv('./hate_speech_dataset.csv')


# Extract the first 10 text values into a new variable

nrOfTextValuesToExtract = 10

texts = [text for text in df['text'][:nrOfTextValuesToExtract]]

# Printing the first 5 texts as an example
print(texts[:5])

# Perspective API part

def check_toxicity(text):
    API_KEY = 'AIzaSyCPqcEMLLCx7e1DpQGIx0ujANhdfMsW3Mk'

    client = discovery.build(
        "commentanalyzer",
        "v1alpha1",
        developerKey=API_KEY,
        discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
        static_discovery=False,
    )

    analyze_request = {
        'comment': {'text': text},
        'requestedAttributes': {
            'TOXICITY': {},
            'SEVERE_TOXICITY': {},
            'IDENTITY_ATTACK': {},
            'INSULT': {},
            'PROFANITY': {},
            'THREAT': {},
            'SEXUALLY_EXPLICIT': {},
            'ATTACK_ON_AUTHOR': {},
            'ATTACK_ON_COMMENTER': {},
            'INFLAMMATORY': {},
            'OBSCENE': {}
        }
    }

    response = client.comments().analyze(body=analyze_request).execute()
    response_json = json.dumps(response, indent=2)
    response = json.loads(response_json)

    toxicity_attributes = [
        'TOXICITY',
        'SEVERE_TOXICITY',
        'IDENTITY_ATTACK',
        'INSULT',
        'PROFANITY',
        'THREAT',
        'SEXUALLY_EXPLICIT',
        'ATTACK_ON_AUTHOR',
        'ATTACK_ON_COMMENTER',
        'INFLAMMATORY',
        'OBSCENE'
    ]

    toxic_comments = []
    for attribute in toxicity_attributes:
        if response['attributeScores'][attribute]['summaryScore']['value'] > 0.5:
            toxic_comments.append({
                'text': text,
                'toxicity_attribute': attribute,
                'score': response['attributeScores'][attribute]['summaryScore']['value']
            })

    return toxic_comments



toxic_comments = []

# Loop over the texts and check toxicity
for i, text in enumerate(texts, start=1):
    print(f"Text {i}: {text}")
    print(check_toxicity(text))
    print()

# Loop over the texts and check toxicity
for text in texts:
    toxic_comments.extend(check_toxicity(text))

# Print toxic comments
if toxic_comments:
    for comment in toxic_comments:
        print(f"Text: {comment['text']}")
        print(f"Toxicity Attribute: {comment['toxicity_attribute']}")
        print(f"Score: {comment['score']}")
        print()
else:
    print("No toxic comments found.")


# Remove duplicate toxic comments
unique_toxic_comments = []
for comment in toxic_comments:
    if comment not in unique_toxic_comments:
        unique_toxic_comments.append(comment)

leftoverToxicCommentsToCSV = False

def WriteLeftOverToxicCommentsCSV():
    # Write toxic comments to CSV file
    if unique_toxic_comments:
        with open('toxic_comments.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Text', 'Toxicity Attribute', 'Score']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for comment in unique_toxic_comments:
                writer.writerow({'Text': comment['text'], 'Toxicity Attribute': comment['toxicity_attribute'], 'Score': comment['score']})
        leftoverToxicCommentsToCSV = True
    else:
        print("No toxic comments found.")

# WriteLeftOverToxicCommentsCSV()
unique_texts = []

if leftoverToxicCommentsToCSV:
    # Read the CSV file
    df = pd.read_csv('toxic_comments.csv')
    # Extract unique text values from the 'text' column
    unique_texts = df['Text'].unique().tolist()
else:
    for item in unique_toxic_comments:
        unique_texts.append(item['text'])



# Print the length of the list
print("Nr of text values in the list:", len(unique_texts) + 1)
print("So out of ", nrOfTextValuesToExtract, " Perspective API found that", len(unique_texts) + 1, " were considered having medium to high toxic attributes" )

unique_texts[0]

# LLM

# OpenAI part

load_dotenv()
openai_apikey = os.getenv('openai_apikey')
os.environ['OPENAI_API_KEY'] = openai_apikey
client = OpenAI()

# Function to generate responses for each text
def generate_responses(texts):
    responses = []
    for text in texts:
        gpt_user_prompt = f"""Classify the following texts into 'hate speech', 
        or 'not'. For 'hate speech', consider if it is gender offensive, race offensive, 
        national origin offensive, disability offensive, religion offensive, 
        or sexual orientation offensive.{text} . Output short: class only and then generate counterspeech."""
        gpt_prompt = gpt_user_prompt
        print(gpt_prompt)
        
        message=[{"role": "user", "content": gpt_user_prompt}]
        temperature=0.5
        max_tokens=120
        frequency_penalty=0.0


        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = message,
            temperature=temperature,
            max_tokens=max_tokens,
            frequency_penalty=frequency_penalty
        )
        print(response.choices[0].message.content)
        
        
       
        responses.append(response.choices[0].message.content)
    return responses



# Generate responses
responses = generate_responses(unique_texts)

# Print the list of responses
print("List of Responses:")
for idx, response in enumerate(responses):
    print(f"{idx + 1}. {response}")

def saveOpenAIResponsesToCSV():
    # Save unique_texts and responses to a DataFrame
    data = {'Text': unique_texts, 'Response': responses}
    df = pd.DataFrame(data)

    # Remove empty rows
    # Removing empty rows does not work actually
    df = df.dropna(subset=['Text', 'Response'])

    # Save DataFrame to a CSV file
    df.to_csv('responses.csv', index=False)


saveDatasetAsCSV()