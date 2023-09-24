import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { useState } from 'react';
function App() {
  return (
    <div>
      <Navbar/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
