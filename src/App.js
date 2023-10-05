import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { useState } from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes,Route } from 'react-router-dom';
import User from './components/User';
function App() {
  const [loginDisplay, setloginDisplay] = useState(false);
  const [signupDisplay, setsignupDisplay] = useState(false);
  return (
    <div>
      <ToastContainer
        autoClose={2000}
        theme='dark'
      />
      <Routes>
        <Route exact path='/' element={<><Navbar setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
        <Home loginDisplay={loginDisplay} signupDisplay={signupDisplay} setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
        <Footer/></>}/>
        <Route exact path="/user" element={<User/>}/> 
      </Routes>
    </div>
  );
}

export default App;
