from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow all origins to access this Flask app

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['scraping2']
collection = db['bitcoin_addresses']

@app.route('/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB's default _id field
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
