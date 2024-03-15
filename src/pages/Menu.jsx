import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "../styles/Menu.css"

const Menu = () => {
    const [items, setItems] = useState([]);
    const [tb_No, settb_No] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showConfPopup, setShowConfPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const tb_no = params.get('tb_no');
                const response = await axios.get('https://hi-foodiez-be.onrender.com/menu', {
                    params: {
                        tb_no: tb_no
                    }
                });
                const menus = response.data.fullMenu.map((val, index) => {
                    return {
                        ...val,
                        quantity: 1
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
            if (selectedItems[i].name === item.name) {
                alreadyAdded = true;
                break;
            }
        }
        console.log(alreadyAdded);
        if (!alreadyAdded) {
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
                const response = await fetch('https://hi-foodiez-be.onrender.com/order', {
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
                setShowConfPopup(true);
                setOrderStatus('Order placed successfully');
                setTimeout(() => {
                    window.location = "/order";
                }, 3000);
            }
            else {
                setOrderStatus('Select Order');
            }
        } catch (error) {
            console.error("Error is:", error);
        }
    }

    const addItems = (isPlus, index) => {
        const snapshot = selectedItems.map((val, i) => {
            if (i === index) {
                const newQuantity = isPlus ? val.quantity + 1 : val.quantity - 1;
                if (newQuantity === 0) {
                    return null; // Remove item from list
                }
                return {
                    ...val,
                    quantity: newQuantity
                };
            }
            return val;
        }).filter(item => item !== null); // Filter out null values
        setSelectedItems(snapshot);
    };

    const calculateSubtotal = () => {
        let subtotal = 0;
        selectedItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        return subtotal.toFixed(2);
    };

    return (
        <>
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
            </div>
            {selectedItems.length > 0 &&
                <div id='cart' className='show'>
                    <h2>Cart Items</h2>
                    <ul>
                        {selectedItems.map((item, index) => (
                            <li key={index}>
                                <p>{item.name}</p>
                                <div>
                                    <button onClick={() => addItems(true, index)}>+</button>
                                    <span id='quantity'>{item.quantity}</span>
                                    <button onClick={() => addItems(false, index)}>-</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {selectedItems.length > 0 &&
                        <div id='subtotal' className='show-cart'>
                            <p>Subtotal:</p>
                            <h4>${calculateSubtotal()}</h4>
                        </div>
                    }
                    <button id='order-btn' onClick={showConfirm}>Place Order</button>
                </div>
            }
            {isOpen &&
                <div id='popup-screen'>
                    <div className='popup'>
                        {
                            showConfPopup ?
                                <div id='success-order'>
                                    <img src="/successLogo.svg" alt="" />
                                    <p >
                                        {orderStatus}
                                    </p>
                                </div> :
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                                    <h1>Please confirm your order</h1>
                                    <p>If you are satisfied with selected items please click the “confirm” button</p>
                                    <div id="popup-btn">
                                        <button onClick={placeOrder}>Confirm</button>
                                        <button onClick={() => setIsOpen(false)}>Close</button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Menu;
