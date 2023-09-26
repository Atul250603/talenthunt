import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { useState } from 'react';
function App() {
  const [loginDisplay, setloginDisplay] = useState(false);
  const [signupDisplay, setsignupDisplay] = useState(false);
  return (
    <div>
      <Navbar setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
      <Home loginDisplay={loginDisplay} signupDisplay={signupDisplay} setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
      <Footer/>
    </div>
  );
}

export default App;
