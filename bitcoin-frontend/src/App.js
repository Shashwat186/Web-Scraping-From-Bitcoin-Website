import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 100; // Number of records per page

  useEffect(() => {
    // Fetch data for the current page
    axios.get(`http://localhost:5000/data?page=${currentPage}&limit=${recordsPerPage}`)
      .then(response => {
        setData(response.data.records);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [currentPage]);

  // Create an array of page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 5 && i <= currentPage + 5)) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="App">
      <h1>Bitcoin Addresses Data</h1>
      <table>
        <thead>
          <tr>
            <th>Page Number</th>
            <th>Rank</th>
            <th>Address</th>
            <th>Balance</th>
            <th>% of coins</th>
            <th>First In</th>
            <th>Last In</th>
            <th>Ins</th>
            <th>First Out</th>
            <th>Last Out</th>
            <th>Outs</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.page_number}</td>
              {item.row_data.map((dataPoint, dataIndex) => (
                <td key={dataIndex}>{dataPoint}</td>
              ))}
              <td>{item.address}</td>
              <td>{item.balance}</td>
              <td>{item.percentage_of_coins}</td>
              <td>{item.first_in}</td>
              <td>{item.last_in}</td>
              <td>{item.ins}</td>
              <td>{item.first_out}</td>
              <td>{item.last_out}</td>
              <td>{item.outs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
