FROM python:3.12.2-alpine

# Install system dependencies
RUN apk add --no-cache build-base

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Define environment variables
ENV FLASK_APP=main.py
ENV FLASK_ENV=development

# Expose port for the Flask app
EXPOSE 8000

# Command to run the app
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
