import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "../styles/Menu.css"

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
                const response = await axios.get('https://hi-foodiez.netlify.app/menu', {
                    params: {
                        tb_no: tb_no
                    }
                });
                const menus = response.data.fullMenu.map((val, index) => {
                    return {
                        ...val,
                        quantity: 0
                    }
                })
                console.log(menus);
                setItems(menus);
                settb_No(tb_no)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const addItemToCart = (item) => {
        console.log(item, selectedItems);
        let alreadyAdded = false;
        for (let i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i].name == item.name) {
                alreadyAdded = true;
                break;
            }
        }
        console.log(alreadyAdded);
        if (alreadyAdded == false) {
            setSelectedItems(prevItems => [...prevItems, item]);
        }
    };

    const showConfirm = () => {
        setIsOpen(true);
    }

    const placeOrder = async () => {
        try {
            if (selectedItems.length > 0) {
                const itemNames = selectedItems.map(item => {
                    return {
                        name: item.name,
                        quantity: item.quantity
                    }
                });
                const response = await fetch('https://hi-foodiez.netlify.app/order', {
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
                    // window.location = "/order";
                }, 2000);
            }
            else {
                setOrderStatus('Select Order')
            }
        } catch (error) {
            console.error("Error is:", error);
        }
    }

    const addItems = (isPlus, index) => {
        const snapshot = selectedItems.map((val, i) => {
            if (i === index) {
                return {
                    ...val,
                    quantity: isPlus ? val.quantity + 1 : val.quantity > 0 ? val.quantity - 1 : 0
                }
            }
            return val
        })
        setSelectedItems(snapshot)
    }
    return (
        <div id='menu_container'>
            <nav>
                <img src="/logo.svg" alt="" />
            </nav>
            <section>
                <p id='table_no'>Order for Table No: <span>{tb_No}</span></p>
                {
                    items.map((item, index) => (
                        <div className='single_item' key={index}>
                            <div id="details">
                                <div className='image-holder' style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div id="item_detail">
                                    <h2>{item.name}</h2>
                                    <p>{item.ingredients + ""}</p>
                                    <h5>{"$ " + item.price}</h5>
                                </div>
                            <button onClick={() => addItemToCart(item)}>Add to cart</button>
                            </div>
                        </div>
                    ))
                }
            </section>
            <h2>Items in Cart:</h2>
            <ul>
                {selectedItems.length > 0 && selectedItems.map((item, index) => (
                    <li key={index}>
                        {item.name}
                        <button onClick={() => addItems(true, index)}>+</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addItems(false, index)}>-</button>
                    </li>
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

