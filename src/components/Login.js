import cross from '../images/cross.svg'
import viewIcon from '../images/view.svg'
import hideIcon from '../images/hide.svg'
import { useState } from 'react'
import {toast } from 'react-toastify';

function Login({loginDisplay,setloginDisplay}){
    const [view, setview] = useState(false);
    const [email,setEmail]=useState('');
    const [pass,setPass]=useState('');
    function validData(){
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var passformat=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if(!(email.trim()).match(mailformat)){
            toast.error('Email Id Is Not Valid');
            return false;
        }
        else if(!(pass.trim()).match(passformat)){
            toast.error('Password Should Contain Letters, Numbers, Special Characters And Must Be Atleast 8 Characters Long');
            return false;
        }
        return true;
    }
    async function loginHandler(){
        if(validData()){
            let resp=await fetch('http://localhost:5000/auth/login',{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password:pass})
            });
            let msg=await resp.json();
            if(msg && msg.success){
                let storage=localStorage.getItem('storage');
                if(storage){
                    storage=JSON.parse(storage);
                    storage={...storage,auth:msg.token};
                    localStorage.setItem('storage',JSON.stringify(storage));
                }
                toast.success(msg.success);
                setEmail('');
                setPass('');
                setloginDisplay(false);
            }
            else if(msg && msg.error){
                toast.error(msg.error);
            }
            else{
                toast.error("Error In Logging In");
            }
        }
    } 
    return(
        <div className={`fixed top-0 right-0 h-screen px-2 shadow-2xl flex items-center w-1/4 bg-white z-40 slide ${(loginDisplay)?"slideIn":"slideOut"}`}>
            <div className="w-full form">
            <div className="px-3 flex items-center justify-between py-4 mb-4">
                <div className='text-purple-600 text-3xl font-semibold'>Login</div>
                <div className='hover:cursor-pointer'><img src={cross} alt="cross" onClick={()=>{setloginDisplay(false)}}/></div>
            </div>
            <div className="w-full px-3 ">
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full">
                    <div className="text-purple-600">Email</div>
                    <div className="py-1 w-full"><input type="mail" name="mail" id="mail" className="outline-none w-full" value={email} onChange={(e)=>{setEmail(e.target.value)}} autoComplete="off"/></div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full mt-5" >
                    <div className="text-purple-600">Password</div>
                    <div className="py-1 w-full flex items-center"><input type={`${(!view)?"password":"text"}`} name="password" id="lpassword" value={pass} onChange={(e)=>{setPass(e.target.value)}} className="outline-none w-full" autoComplete="off"/>{(!view)?<img src={viewIcon} alt="view" onClick={()=>{setview(true)}} className='hover:cursor-pointer'/>:<img src={hideIcon} alt="hide" onClick={()=>{setview(false)}} className='hover:cursor-pointer'/>}</div>
                </div>
                <div className="text-center mt-6">
                <button className="text-white rounded bg-purple-600 px-3 py-3 w-full" onClick={()=>{loginHandler()}}>Login</button>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Login;