import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 100;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/data?page=${currentPage}&limit=${recordsPerPage}`);
        if (response.data) {
          setData(response.data.data);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderRows = () => {
    if (loading) return <tr><td colSpan="11">Loading...</td></tr>;
    if (data.length === 0) return <tr><td colSpan="11">No data available</td></tr>;

    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.page_number || 'N/A'}</td>
        <td>{item.row_data[0] || 'N/A'}</td>
        <td>{item.row_data[1] || 'N/A'}</td>
        <td>{item.row_data[2] || 'N/A'}</td>
        <td>{item.row_data[3] || 'N/A'}</td>
        <td>{item.row_data[4] || 'N/A'}</td>
        <td>{item.row_data[5] || 'N/A'}</td>
        <td>{item.row_data[6] || 'N/A'}</td>
        <td>{item.row_data[7] || 'N/A'}</td>
        <td>{item.row_data[8] || 'N/A'}</td>
        <td>{item.row_data[9] || 'N/A'}</td>
      </tr>
    ));
  };

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
          {renderRows()}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={i + 1 === currentPage ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default App;
