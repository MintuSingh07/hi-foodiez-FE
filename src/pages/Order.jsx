import React, { useState, useEffect } from 'react';

const Order = () => {
  const [time, setTime] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime === 0) {
          clearInterval(interval);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);


    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <>
      <p>Your Order will be at your table shortly...</p>
      <p>Time remaining: {minutes} minute{minutes !== 1 ? 's' : ''} {seconds} second{seconds !== 1 ? 's' : ''}</p>
    </>
  );
}

export default Order;
