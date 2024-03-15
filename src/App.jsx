import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Order from './pages/Order';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/menu' element={<Menu />} />
          <Route path='/order' element={<Order />} />
        </Routes>
      </Router>
    </>
  )
}

export default App