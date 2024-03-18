import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Set the OpenAI API key from an environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

# Example dynamic inputs - for script demonstration, replace with actual input() if running interactively
assistant_role = "helper"  # Example role, replace with input("Who should I be, as I answer your prompt?") for interactive use
user_prompt = "Tell me a joke."  # Example prompt, replace with input("What prompt do you want me to do?") for interactive use

gpt_assistant_prompt = f"You are a {assistant_role}."
gpt_user_prompt = user_prompt
print(f"Assistant Role: {gpt_assistant_prompt}, User Prompt: {gpt_user_prompt}")

# Prepare the message format as required by the API
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": gpt_user_prompt}
]

# Making the API call for a chat completion
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages,
    temperature=0.5,
    max_tokens=256,
    frequency_penalty=0.0
)

# Print the response from the model
print(response.choices[0].message)
