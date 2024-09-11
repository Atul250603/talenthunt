import { useEffect, useId, useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userAvatar from '../../images/userAvatar.png';
import { toast } from "react-toastify";
import {uid} from 'uid';
function InterviewForm(){
    const [showSpinner,setShowSpinner]=useState(false);
    const[interviewname,setinterviewname]=useState('');
    const [interviewdate,setinterviewdate]=useState(null);
    const [currjob,setcurrjob]=useState(null);
    const [selected,setselected]=useState(null);
    const {id}=useParams();
    const {state}=useLocation();
    const navigate=useNavigate();
    useEffect(()=>{
        async function init(){
            try{
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=await JSON.parse(storage);
                if(storage && storage.auth){
                    if(storage.user && storage.user.type==='Candidate'){
                        navigate('/user/projects/')
                    }
                    else if(storage.user && storage.user.type==='Organizer'){
                        navigate('/org/hackathons/')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/recruiter/profile/');
                        }
                        else{
                            if(state && state.job){
                                setcurrjob(state.job);
                            }
                            else{
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/myjob/${id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        const job=msg.job;
                        
                        setcurrjob(job)
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw "Some Error Occured";
                    }
                    }
                }
                }
            }
                else{
                    navigate('/');
                }
            }
            catch(error){
                toast.error(error,{
                    toastId:"recruiterId"
                });
                navigate('/recruiter/jobs');
            }
        }
        init();
    },[])
    function validate(){
        try{
           
            let namelen=(interviewname.trim()).length;
            let datelen=(String(interviewdate).trim()).length;
            let dateval=new Date(interviewdate);
            if(namelen<=0){
                throw 'Interview Name Is Required';
            }
            if(datelen<=0){
                throw 'Interview Date Is Required';
            }
            if(dateval.toLocaleDateString()<=(new Date().toLocaleDateString())){
               
                throw 'Interview Date Must Be A Future Date';
            }
            if(selected===null){
                throw 'Interviewee Must Be Selected'
            }
            if(namelen>0 && datelen>0 && dateval.toLocaleDateString()>(new Date().toLocaleDateString()) && selected!==null){
               return true;
            }
        }
        catch(error){            
            toast.error(error,{
                toastId:"interviewformerrorid1"
            });
            return false;
        }
    }
    async function schedule(){
        try{
            if(validate()){
                setShowSpinner(true);
                const roomid=uid(32);
                const data={
                    interviewname,
                    interviewdate,
                    interviewee:currjob.shortlisted[selected],
                    roomId:roomid
                }
                let storage=localStorage.getItem('storage');
                storage=await JSON.parse(storage);
                if(storage && storage.auth){
                    let resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/scheduleinterview/${id}`,{
                    method:"post",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    },
                    body:JSON.stringify(data)
                    });
                    let msg=await resp.json();
                    if(msg && msg.success){
                        setShowSpinner(false);
                        toast.success(msg.success);
                        navigate(`/recruiter/jobs/${id}`);
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw 'Some Error Occured';
                    }
                }
            }
        }
        catch(error){
            setShowSpinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-full bg-slate-100 px-4 py-2 heading overflow-y-hidden">
            {(currjob)?<div className="w-full h-full">
            <div className="text-2xl font-semibold text-purple-600 text-center">Schedule Interview</div>
            <div className="w-full h-full flex flex-col items-center">
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 font-semibold my-2">
                        <div className="text-purple-600 font-semibold">Interview Name</div>
                        <div className="py-1 w-full">
                            <input name='assignmentname' id='assignmentname' value={interviewname} onChange={(e)=>{setinterviewname(e.target.value);}} className='resize-none outline-none w-full bg-slate-500 text-white p-2'/> 
                        </div>
                    </div>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 font-semibold my-2">
                        <div className="text-purple-600 font-semibold">Interview Date</div>
                        <div className="py-1 w-full">
                            <DatePicker
                                selected={interviewdate}
                                onChange={(value)=>{setinterviewdate(value);}}
                                showTimeSelect
                                dateFormat="Pp"
                                wrapperClassName='w-full'
                                className='p-2 resize-none outline-none w-full bg-slate-500 text-white'
                            /> 
                        </div>
                    </div>
                    <div className="max-h-[45%] border-2 border-purple-600 rounded px-3 py-2 pb-3 w-3/4 font-semibold my-2">
                        <div className="text-purple-600 font-semibold py-1">Select Interviewee </div>
                        <div className="w-full flex gap-2 flex-wrap h-[85%] overflow-y-auto">
                        {
                          currjob.shortlisted.map((element,idx)=><div className={`w-[49%] bg-slate-300 rounded-xl px-3 py-3 hover:cursor-pointer ${(selected===idx)?"border-2 border-purple-600":""}`} key={idx} onClick={()=>setselected(idx)}>
                            <div className="flex items-center gap-3">
                                <div className="w-[70px] h-[70px] rounded-full">
                                    <img src={(element.userInfo.profileImg)?element.userInfo.profileImg:userAvatar} alt="icon" className="w-full h-full rounded-full border-2 border-purple-600"/>
                                </div>
                                <div className="font-semibold">
                                    <div className="capitalize">{element.userInfo.fname+" "+element.userInfo.lname}</div>
                                    <div>{element.userInfo.email}</div>
                                </div>   
                            </div>
                            <div className="flex w-full gap-2 items-center justify-center">
                                <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>{navigate(`/recruiter/userprofile/${element.userInfo.userId}/${id}`)}}>View Profile</div>
                            </div>
                            </div>)
                        }
                        </div>
                    </div>
                    <div>
                    <button className={`font-semibold text-white bg-purple-600 p-3 rounded-full hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400`}  onClick={()=>schedule()}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>:<></>}
                    Schedule Interview
                </button>
                    </div>
                </div>
                </div>:<div className="flex items-center justify-center font-semibold">Loading....</div>}
        </div>
    )
}
export default InterviewForm;