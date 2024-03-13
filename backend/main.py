from server import app
from database import database_local
# from fastapi_api import app
import uvicorn





if __name__ == '__main__':
    database_local()
    app.run(debug=True, port= 8000)
    # uvicorn.run(app, host="0.0.0.0", port=5001)