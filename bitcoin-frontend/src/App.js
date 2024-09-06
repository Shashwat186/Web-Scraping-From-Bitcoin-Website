import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Bitcoin Addresses Data</h1>
      <table>
        <thead>
          <tr>
            <th>Page Number</th>
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
    </div>
  );
}

export default App;

