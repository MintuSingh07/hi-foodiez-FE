import axios from 'axios';
import React, { useState, useEffect } from 'react'

const App = () => {
  const [items, setItems] = useState([]);
  const [tb_No, settb_No] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tb_no = params.get('tb_no');
        const response = await axios.get('http://localhost:8000/menu', {
          params: {
            tb_no: tb_no
          }
        });
        setItems(response.data.fullMenu);
        settb_No(tb_no)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const addItemToCart = (item) => {
    !selectedItems.includes(item) ? setSelectedItems(prevItems => [...prevItems, item]) : null;
  };

  const placeOrder = async () => {
    try {
      const itemNames = selectedItems.map(item => item.name);
      console.log(itemNames);
      const response = await axios.post('http://localhost:8000/order', {
        tableNumber: tb_No,
        items: itemNames
      })
      console.log('Order placed successfully:', response.data);
    } catch (error) {
      console.error("Error is:",error);
    }
  }
  return (
    <div>
      <h1>Table No: {tb_No}</h1>
      {
        items.map((item, index) => (
          <ul key={index}>
            <li>{item.name}</li>
            <li>{item.isVeg ? "Veg" : "Non-Veg"}</li>
            <li>{item.price}</li>
            <button onClick={() => addItemToCart(item)}>+</button>
          </ul>
        ))
      }
      <h2>Items in Cart:</h2>
      <ul>
        {selectedItems.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  )
}

export default App
