# Use an official Python runtime as a parent image
FROM python:3.12.2-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable to specify where the Flask app is located
ENV FLASK_APP=server.py

# Run the app when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
