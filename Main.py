import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['bitcoin_data']
collection = db['richest_addresses']

# URL of the website
url = 'https://bitinfocharts.com/top-100-richest-bitcoin-addresses-5.html'

# Fetch the web page
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Debugging: Print the raw HTML to check if the page content is correctly fetched
print("Raw HTML content:")
print(soup.prettify()[:2000])  # Print first 2000 characters for brevity

# Find the table
table = soup.find('table')
if table is None:
    print("No table found.")
else:
    print("Table found.")

# Extract data
data = []
tbody = table.find('tbody')
for row in tbody.find_all('tr'):
    cols = row.find_all('td')
    if len(cols) > 1:  # Ensure there are enough columns
        # Extract address from the second column
        address_tag = cols[1].find('a')
        address = address_tag.text.strip() if address_tag else cols[1].text.strip()

        # Extract balance from the third column
        balance = cols[2].text.strip() if len(cols) > 2 else None

        if address and balance:
            data.append({'address': address, 'balance': balance})

# Debugging: Print the data collected before inserting into MongoDB
print("Data extracted:")
print(data)

# Insert data into MongoDB
if data:
    collection.insert_many(data)
    print(f"Inserted {len(data)} records into MongoDB.")
else:
    print("No data found to insert.")