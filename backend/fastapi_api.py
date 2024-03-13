from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define allowed origins for CORS
# Use ["*"] for open access, but be cautious and ideally specify actual domains in production
origins = [
    "*",
]

# Setting up CORS middleware for FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get('/api/data')
def get_data():
    data = {"message": "This is the data from Flask."}
    return JSONResponse(content=data)

@app.get("/extension/default")
def get_default_extension():
    data = {"prompt": "Highlighted"}
    return JSONResponse(content=data)
