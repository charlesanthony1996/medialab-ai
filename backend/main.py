from server import app
from database import database_local





if __name__ == '__main__':
    database_local()
    app.run(debug=True)