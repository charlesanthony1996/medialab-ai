from openai import OpenAI
from api_keys_file import open_api_key2

client = OpenAI(api_key=open_api_key2)

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "Tell me a joke"},
  ]
)

print(completion.choices[0].message.content)