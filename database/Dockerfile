FROM python:3.12.2-alpine

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir Flask

EXPOSE 5001

CMD ["python", "database.py"]
