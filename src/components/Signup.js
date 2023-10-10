import { useEffect, useState } from 'react';
import cross from '../images/cross.svg'
import viewIcon from '../images/view.svg'
import hideIcon from '../images/hide.svg'
import OtpInput from 'react-otp-input';
import {toast } from 'react-toastify';
function Signup({signupDisplay,setsignupDisplay,setloginDisplay}){
    const [view, setview] = useState(false);
    const[email,setEmail]=useState("");
    const[pass,setPass]=useState("");
    const [otp, setOtp] = useState('');
    const [verified,setVerified]=useState(false);
    const [otpSent,setotpSent]=useState(false);
    const [showSpinner,setShowSpinner]=useState(false);
    const [type,setType]=useState("");
    const [genOTP,setgenOTP]=useState('');
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
        else if(!(type.trim()).length){
            toast.error('You Must Select The User Type');
            return false;
        }
        return true;
    }
    function onemailChange(e){
        setotpSent(false);
        setOtp('');
        setEmail(e.target.value);
    }
    async function sendOTP(){
        try{
        setShowSpinner(true);
        let genOTP=Math.floor(1000 + Math.random() * 9000);
        setgenOTP(genOTP);
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if((email.trim()).match(mailformat))
        {
           let resp=await fetch('http://localhost:5000/auth/emailverify',{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,otp:genOTP})
           });
           let msg=await resp.json();
           if(msg && msg.success && msg.success.length){
            toast.success('OTP Sent Successfully');
            setotpSent(true);
           }
           else if(msg && msg.error){
            toast.error(msg.error);
           }
           else{
            toast.error("Error In Sending OTP");
           }
        }
        else{
            toast.error('Invalid Email Address');
        }
        setShowSpinner(false);
        return;
        }
        catch(error){
        setShowSpinner(false);
        toast.error("Error in Sending OTP")
        }
    }
    async function verifyOTP(){
        try{
        setShowSpinner(true);
        if(String(genOTP)===otp){
            setVerified(true);
        }
        setShowSpinner(false);
        }
        catch(error){
            setShowSpinner(false);
            toast.error("Error In Verifying OTP");
        }
    }
    async function signupHandler(){
        try{
        if(validData()){
            setShowSpinner(true);
            let resp=await fetch("http://localhost:5000/auth/signup",{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password:pass,type})
            });
            let msg=await resp.json();
            if(msg && msg.success && msg.success.length){
                setEmail('');
                setVerified(false);
                setotpSent(false);
                setType('');
                setPass("");
                toast.success(msg.success);
                setsignupDisplay(false);
                setloginDisplay(true);
            }
            else if(msg && msg.error){
                toast.error(msg.error);
            }
            else{
                toast.error("Error In Signing Up")
            }
            setShowSpinner(false);
        }
        }
        catch(error){
            setShowSpinner(false);
            toast.error("Error In Signing Up");
        }
    }
    return(
        <div className={`fixed top-0 right-0 h-screen px-2 shadow-2xl flex items-center w-1/4 bg-white z-40 slide ${(signupDisplay)?"slideIn":"slideOut"}`}>
            <div className="w-full form">
            <div className="px-3 flex items-center justify-between py-4 mb-4">
                <div className='text-purple-600 text-3xl font-semibold'>Signup</div>
                <div className='hover:cursor-pointer'><img src={cross} alt="cross" onClick={()=>{setsignupDisplay(false)}}/></div>
            </div>
            <div className="w-full px-3 ">
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full">
                    <div className="text-purple-600">Email</div>
                    <div className="py-1 w-full"><input type="mail" name="mail" id="mail" value={email} onChange={(e)=>{onemailChange(e)}} className="outline-none w-full bg-white disabled:cursor-not-allowed" disabled={(verified)?true:false} autoComplete="off"/></div>
                </div>
                {(!verified)?
                    <div>
                        {(!otpSent)?<div className='mt-6 w-full'>
                        <button className="text-white rounded bg-purple-600 px-3 py-3 w-full" onClick={()=>{sendOTP()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>:<></>}Send OTP</button>
                        </div>:
                        <div>
                            <div>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={4}
                                    renderInput={(props)=><input {...props} />}
                                    containerStyle="w-full d-flex justify-center mt-5"
                                    inputStyle="border-2 border-purple-600 mx-2 text-4xl"
                                />
                            </div>
                            <div className='mt-6'>
                                <button className="text-white rounded bg-purple-600 px-3 py-3 w-full" onClick={()=>{verifyOTP()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>:<></>}Verify</button>
                            </div>
                        </div>}
                    </div>:<div>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-full mt-5" >
                        <div className="text-purple-600">Password</div>
                        <div className="py-1 w-full flex items-center"><input type={`${(!view)?"password":"text"}`} name="spassword" id="spassword" value={pass} onChange={(e)=>{setPass(e.target.value)}} className="outline-none w-full bg-white" autoComplete="off"/>{(!view)?<img src={viewIcon} alt="view" onClick={()=>{setview(true)}} className='hover:cursor-pointer'/>:<img src={hideIcon} alt="hide" onClick={()=>{setview(false)}} className='hover:cursor-pointer'/>}</div>
                    </div>
                    <div className='mt-5'>
                        <div className='text-purple-600 font-semibold'>Registering As</div>
                        <div className='w-full flex mt-4 gap-2'>
                            <div>
                                <input type="radio" id="candidate" name="type" value="Candidate" className="hidden peer" onChange={()=>{setType("Candidate")}}/>
                                <label htmlFor="candidate" className="inline-flex items-center justify-between  p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-purple-600 peer-checked:border-2 peer-checked:border-purple-600 peer-checked:text-purple-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                    <div>
                                        <div className="w-full text-sm font-semibold">Candidate</div>        
                                    </div>
                                </label>
                            </div>
                            <div>
                                <input type="radio" id="recruiter" name="type" value="Recruiter" className="hidden peer" onChange={()=>{setType("Recruiter")}}/>
                                <label htmlFor="recruiter" className="inline-flex items-center justify-between  p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-purple-600 peer-checked:border-2 peer-checked:border-purple-600 peer-checked:text-purple-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                    <div>
                                        <div className="w-full text-sm font-semibold">Recruiter</div>
                                    </div>
                                </label>
                            </div>
                            <div>
                                <input type="radio" id="organizer" name="type" value="Organizer" className="hidden peer" onChange={()=>{setType("Organizer")}}/>
                                <label htmlFor="organizer" className="inline-flex items-center justify-between p-1 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-purple-600 peer-checked:border-2 peer-checked:border-purple-600 peer-checked:text-purple-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                    <div>
                                        <div className="w-full text-sm font-semibold">Organizer</div>
                                        
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                <div className="text-center mt-6">
                    <button className="text-white rounded bg-purple-600 px-3 py-3 w-full" onClick={()=>{signupHandler()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>:<></>}Signup</button>
                </div></div>
                }
            </div>
            </div>
        </div>
    )
}
export default Signup;