from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "This is the data from Flask."}
    return jsonify(data)

@app.route("/extension/default", methods=["GET"])
def get_default_extension():
    data = { "prompt": "Highlighted"}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)