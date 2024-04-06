from openai import OpenAI
from api_keys_file import open_api_key2

client = OpenAI(api_key=open_api_key2)

# completion = client.chat.completions.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "system", "content": "Tell me a joke"},
#   ]
# )

# print(completion.choices[0].message.content)

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
    # response_message = response.choices[0].message.content
    return analysis_result, None
  except Exception as e:
    return None, str(e)



  