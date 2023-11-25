import cross from '../images/cross.svg'
import viewIcon from '../images/view.svg'
import hideIcon from '../images/hide.svg'
import { useState } from 'react'
import {toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Login({loginDisplay,setloginDisplay}){
    const [view, setview] = useState(false);
    const [email,setEmail]=useState('');
    const [pass,setPass]=useState('');
    const[showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
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
        try{
        if(validData()){
            setshowSpinner(true);
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
                storage={auth:msg.token,user:msg.user};
                localStorage.setItem('storage',JSON.stringify(storage));
                toast.success(msg.success);
                setEmail('');
                setPass('');
                setloginDisplay(false);
                if(msg.user.type==='Candidate'){
                    if(msg.user.profileCompleted)
                        navigate('/user/projects/');
                    if(!msg.user.profileCompleted)
                        navigate('/user/profile');
                }
                else if(msg.user.type==='Organizer'){
                    if(msg.user.profileCompleted)
                        navigate('/org/hackathons/');
                    if(!msg.user.profileCompleted)
                        navigate('/org/profile');
                }
            }
            else if(msg && msg.error){
                toast.error(msg.error);
            }
            else{
                toast.error("Error In Logging In");
            }
            setshowSpinner(false);
        }
    }
    catch(error){
        setshowSpinner(false);
        toast.error("Error In Logging In");
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
                <button className="text-white rounded bg-purple-600 px-3 py-3 w-full disabled:cursor-not-allowed disabled:bg-purple-400" disabled={showSpinner} onClick={()=>{loginHandler()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>:<></>}Login</button>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Login;