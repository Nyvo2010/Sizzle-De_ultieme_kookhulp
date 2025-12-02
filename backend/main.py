from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


def load_user_data():
    if os.path.exists("credentials.json"):
        with open("credentials.json", "r") as file:
            return json.load(file)
    return {}

def save_user_data(data):
    with open("credentials.json", "w") as file:
        json.dump(data, file)

@app.route('/')
def index():
    return "Welcome to the Python login API!"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    users = load_user_data()
    if username in users and users[username] == password:
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid username or password!"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    users = load_user_data()
    if username in users:
        return jsonify({"message": "Username already exists!"}), 400
    users[username] = password
    save_user_data(users)
    return jsonify({"message": "User registered successfully!"}), 201

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
