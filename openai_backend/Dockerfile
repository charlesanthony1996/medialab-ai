# Use an official Python runtime as a parent image
FROM python:3.12.2-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install --no-cache-dir openai
RUN pip install --no-cache-dir python-dotenv
RUN pip install --no-cache-dir Flask
RUN pip install --no-cache-dir Flask-Cors
RUN pip install --no-cache-dir groq
RUN pip install --no-cache-dir langchain
RUN pip install --no-cache-dir langchain-openai
RUN pip install --no-cache-dir langchain-groq
RUN pip install --no-cache-dir chromadb
RUN pip install --no-cache-dir json5
RUN pip install --no-cache-dir langchain-community

# Make port 5000 available to the world outside this container
EXPOSE 6000

# Define environment variable
# ENV MODEL_NAME=gpt-3.5-turbo

# Run llm_backend.py when the container launches
CMD ["python", "llm_backend.py"]
