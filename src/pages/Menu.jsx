import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Menu = () => {
    const [items, setItems] = useState([]);
    const [tb_No, settb_No] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [isOpen, setIsOpen] = useState(false);

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

    const showConfirm = () => {
        setIsOpen(true);
    }

    const placeOrder = async () => {
        try {
            if (selectedItems.length > 0) {
                const itemNames = selectedItems.map(item => item.name);
                console.log(itemNames);
                const response = await fetch('http://localhost:8000/order', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tb_no: tb_No,
                        selectedItems: itemNames
                    })
                })
                console.log('Order placed successfully:', await response.json());
                setOrderStatus('Order placed sucessfully');
                setInterval(() => {
                    window.location = "/order";
                }, 2000);
            }
            else {
                setOrderStatus('Select Order')
            }
        } catch (error) {
            console.error("Error is:", error);
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
            <button onClick={showConfirm}>Place Order</button>
            {
                isOpen ? <button onClick={placeOrder}>Confirm</button> : ""
            }
            {orderStatus}
        </div>
    )
}

export default Menu
