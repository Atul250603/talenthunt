import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { useState } from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [loginDisplay, setloginDisplay] = useState(false);
  const [signupDisplay, setsignupDisplay] = useState(false);
  return (
    <div>
      <ToastContainer
        autoClose={2000}
        theme='dark'
      />
      <Navbar setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
      <Home loginDisplay={loginDisplay} signupDisplay={signupDisplay} setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
      <Footer/>
    </div>
  );
}

export default App;
