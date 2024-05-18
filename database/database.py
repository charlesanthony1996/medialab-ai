import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS
from cachetools import cached, LRUCache

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

cache = LRUCache(maxsize=100)

@app.route('/')
@cached(cache)
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

# database_local()
# print("database loaded")

# settings_info db
settings_database = "settings_info.db"

def get_db():
    conn = sqlite3.connect(settings_database)
    return conn

@app.route("/api/save_settings", methods=["POST"])
@cached(cache)
def save_settings():
    data = request.data_json()
    user_id = data.get("userId")
    settings = data.get("settings")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_settings (user_id, settings) VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET settings=excluded.settings;
    ''', (user_id, json.dumps(settings)))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})


@app.route("/api/load_settings", methods=["GET"])
@cached(cache)
def load_settings():
    user_id = request.args.get('userId')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT settings FROM user_settings WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        settings = json.loads(row[0])
        return jsonify({"settings": settings})
    else:
        return jsonify({"settings": {}})


if __name__ == '__main__':
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS user_settings (
                user_id TEXT PRIMARY KEY,
                settings TEXT
            )
        ''')
    app.run(host='0.0.0.0', port=5001, debug=True)