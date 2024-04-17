# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir numpy
RUN pip install --no-cache-dir torch
RUN pip install --no-cache-dir transformers
RUN pip install --no-cache-dir streamlit
RUN pip install --no-cache-dir Pillow
#RUN pip install --no-cache-dir jax[cpu]
RUN pip install --no-cache-dir flax
RUN pip install --no-cache-dir huggingface_hub
RUN pip install --no-cache-dir googletrans==4.0.0-rc1
RUN pip install --no-cache-dir protobuf==3.20
RUN pip install --no-cache-dir scipy
# Install any needed dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Perform Hugging Face Hub login using the token
RUN huggingface-cli login --token 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

# Run test.py when the container launches
# CMD ["python", "test.py"]

# Make port 7000 available to the world outside this container
EXPOSE 7000

# Define environment variable
# ENV MODEL_NAME=gpt-3.5-turbo

# Run filter.py when the container launches
CMD ["python", "twitterRoberta.py"]
