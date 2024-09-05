import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

# MongoDB connection setup
client = MongoClient('localhost', 27017)  # Connect to local MongoDB, change if using a remote server
db = client['scraping2']  # Database name: 'scraping'
collection = db['bitcoin_addresses']  # Collection name: 'bitcoin_addresses'

def fetch_page_data(url, page_number):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find and ignore the title tag
    title_tag = soup.find('title')
    if title_tag:
        title_text = title_tag.get_text()
        print(f"Processing page {page_number} with title: {title_text}")
    
    # Remove the title tag (optional)
    if title_tag:
        title_tag.decompose()
    
    # Find and ignore the pagination links
    pagination = soup.find('ul')
    if pagination:
        pagination.decompose()
    
    # Find tables after removing title and pagination
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            cols = [col.text.strip() for col in cols]
            if cols:  # Insert non-empty rows into MongoDB
                data = {
                    'page_number': page_number,  # Add the page number for reference
                    'row_data': cols
                }
                collection.insert_one(data)  # Insert the row into MongoDB
                print(f"Inserted data: {cols}")

def main():
    base_url = 'https://bitinfocharts.com/top-100-richest-bitcoin-addresses-'
    max_pages = 100  # Increase the number of pages to 10
    for page in range(1, max_pages + 1):
        url = f"{base_url}{page}.html"
        print(f"Processing {url}")
        fetch_page_data(url, page)

if __name__ == "__main__":
    main()
