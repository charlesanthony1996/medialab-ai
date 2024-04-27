import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({"message": "Database Service Running"})


def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        # print(f"connected to {db_file}, sqlite version: {sqlite3.version}")
    except Exception as e:
        print(e)
    return conn

def create_table(conn):
    try:
        c = conn.cursor()
        c.execute(""" CREATE TABLE IF NOT EXISTS users (
                                        id integer PRIMARY KEY,
                                        name text NOT NULL,
                                        email text NOT NULL
                                    ); """)
        print("table created")
    except Exception as e:
        print(e)

def add_user(conn, user):
    """ add a new user to the users table """
    sql = ''' INSERT INTO users(name,email)
              VALUES(?,?) '''
    cur = conn.cursor()
    cur.execute(sql, user)
    conn.commit()
    return cur.lastrowid

# query and display all users
def get_all_users(conn):
    cur = conn.cursor()
    cur.execute("SELECT * FROM users")

    rows = cur.fetchall()

    for row in rows:
        print(row)

def delete_user(conn):
    pass
    
def database_local():
    database = r"users_info.db"
    # database = r"/app/data/users_info.db"
    print("database created")

    # create the db locally
    conn = create_connection(database)

    if conn is not None:

        create_table(conn)

        # add users
        user1 = ("John doe", "john@test.com")
        add_user(conn, user1)

        # print all users
        print("users in the db")
        get_all_users(conn)

        conn.close()

    else:
        print("Error! cannot create the connection")

database_local()
print("database loaded")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)