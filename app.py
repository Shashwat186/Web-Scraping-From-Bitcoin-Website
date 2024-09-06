from flask import Flask, jsonify, request
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
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        skip = (page - 1) * limit

        total_records = collection.count_documents({})
        total_pages = (total_records + limit - 1) // limit  # Calculate total pages
        
        records = list(collection.find({}, {'_id': 0}).skip(skip).limit(limit))
        
        return jsonify({
            'records': records,
            'totalPages': total_pages
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
