import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import eventIcon from '../../images/eventIconFilled.svg';
import userIcon from '../../images/userIconFilled.svg';
import userAvatar from '../../images/userAvatar.png';
import crossIcon from '../../images/closeIcon.svg';
import trophyIcon from '../../images/trophyIcon.svg';
import { storage } from "../../firebase.config";
function MyJobPage(){
    const [job,setjob]=useState(null);
    const [option,setoption]=useState('');
    const [showSpinner,setShowSpinner]=useState(false);
    const navigate=useNavigate();
    const {id}=useParams();
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
                            setjob(msg.job);
                            if(msg.job.pending && msg.job.pending.length>0)setoption('Pending')
                            else if(msg.job.shortlisted && msg.job.shortlisted.length>0)setoption("Shortlisted");
                            else setoption("Unshortlisted");
                        toast.success(msg.success,{
                            toastId:"recruiterId"
                        });
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
    async function shortlist(element){
        try{
            setShowSpinner(true);
            let idx=job.pending.indexOf(element);
            if(idx>=0){
                let pendingcpy=[...job.pending];
                pendingcpy.splice(idx,1);
                let shortlistedcpy=[...job.shortlisted];
                shortlistedcpy.push(element);
                let storage=localStorage.getItem('storage');
                storage=await JSON.parse(storage);
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/shortlist/${id}/${element.userInfo.userId}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                });
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    setjob((prev)=>({...prev,pending:pendingcpy,shortlisted:shortlistedcpy}));
                    setShowSpinner(false);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw "Some Error Occured";
                }
            }
        }
        catch(error){
            toast.error(error);
            setShowSpinner(false);
        }
    }
    async function unshortlist(element,source){
        try{
            setShowSpinner(true);
            let storage=localStorage.getItem('storage');
            storage=await JSON.parse(storage);
            if(source===0){
                let idx=job.pending.indexOf(element);
                if(idx>=0){
                    let pendingcpy=[...job.pending];
                    pendingcpy.splice(idx,1);
                    let nonshortlistedcpy=[...job.nonshortlisted];
                    nonshortlistedcpy.push(element);
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/unshortlist/${id}/${element.userInfo.userId}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-type":"application/json",
                            "authToken":storage.auth
                        },
                        body:JSON.stringify({source})
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        toast.success(msg.success);
                        setjob((prev)=>({...prev,pending:pendingcpy,nonshortlisted:nonshortlistedcpy}));
                        setShowSpinner(false);

                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw 'Some Error Occured';
                    }
                }
            }
            else if(source===1){
                let idx=job.shortlisted.indexOf(element);
                if(idx>=0){
                let shortlistedcpy=[...job.shortlisted];
                shortlistedcpy.splice(idx,1);
                let nonshortlistedcpy=[...job.nonshortlisted];
                nonshortlistedcpy.push(element);
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/unshortlist/${id}/${element.userInfo.userId}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-type":"application/json",
                        "authToken":storage.auth
                    },
                    body:JSON.stringify({source})
                })
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    setjob((prev)=>({...prev,shortlisted:shortlistedcpy,nonshortlisted:nonshortlistedcpy}));
                    setShowSpinner(false);
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
            toast.error(error);
            setShowSpinner(false);
        }
    }
    return(
        <div className="w-full h-full bg-slate-100 px-2 py-3 heading pb-0">
            {(job)?<div className="w-full h-full px-2 overflow-y-auto pb-2">
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-semibold text-purple-600 text-2xl">{job.jobId.jobTitle}</div>
                    <div className="font-semibold">{job.jobId.organizer}</div>  
                </div>
                {(job.shortlisted && job.shortlisted.length>0 && new Date(job.jobId.appdeadline).getTime()<=new Date().getTime())?<div className="flex gap-2">
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer" onClick={()=>navigate(`/recruiter/assignment/${id}`)}>Take Assignment</div>
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer" onClick={()=>navigate(`/recruiter/interview/${id}`,{state:{job}})}>Schedule Interview</div>
                </div>:<></>}
            </div>   
            <div className="flex gap-2">
                <div>
                {
                    (job.assignments && job.assignments.length>0)?<div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer" onClick={()=>navigate(`/recruiter/jobs/${id}/myassignments`,{state:{assignments:job.assignments}})}>My Assignments</div>:<></>
                }
                </div>
                <div>
                {
                    (job.interviews && job.interviews.length>0)?<div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer" onClick={()=>navigate(`/recruiter/jobs/${id}/myinterviews`,{state:{interviews:job.interviews}})}>My Interviews</div>:<></>
                }
                </div>
            </div>
            <div className="font-semibold text-purple-600">Description</div>
            <div className="break-all text-sm whitespace-pre-line">{job.jobId.description}</div>
            <div className="font-semibold text-purple-600">Application Deadline</div>
            <div>
                {new Date(job.jobId.appdeadline).toLocaleDateString()}
            </div>
            <div className="font-semibold text-purple-600">Salary</div>
            <div>
                {job.jobId.salary}
            </div>
            <div className="font-semibold text-purple-600">Job Location</div>
            <div>
                {job.jobId.location}
            </div>
            <div>{((job.nonshortlisted && job.nonshortlisted.length>0) || (job.shortlisted && job.shortlisted.length>0) || (job.pending&&job.pending.length>0))?<div className="font-semibold text-purple-600">Participants</div>:<div className="flex justify-center font-semibold">No User Data Yet...</div>}
            <div className="flex w-3/4 gap-2 mt-2">
                {(job.nonshortlisted && job.shortlisted && job.pending)?<div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                    <div className="w-[9%]">
                        <img src={userIcon} alt="icon" className="w-full"/>
                    </div>
                    <div className="font-semibold">
                        <div className="text-purple-600 text-sm">Total Users Applied</div>
                        <div>{job.nonshortlisted.length + job.shortlisted.length + job.pending.length}</div>
                    </div>
                </div>:<></>}
                {(job.shortlisted && job.shortlisted.length>0)?<div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                    <div className="w-[9%]">
                        <img src={eventIcon} alt="icon" className="w-full"/>
                    </div>
                    <div className="font-semibold">
                        <div className="text-purple-600 text-sm">Total Users Shortlisted</div>
                        <div>{job.shortlisted.length}</div>
                    </div>
                </div>:<></>}
            </div>
            </div>
            <div className="mt-4 w-full w-100">
                <div className="w-100 flex justify-between">
                    <div className="font-semibold text-purple-600">{option} Candidates</div>
                    <div>
                        <span className="mr-3 text-purple-600 font-semibold">Filter</span>
                        <select className="bg-slate-300 outline-none p-1 rounded-full" onChange={(e)=>setoption(e.target.value)}>
                            <option value={"Pending"} selected={(option==='Pending')}>Pending Candidates</option>
                            <option value={"Shortlisted"} selected={(option==='Shortlisted')}>Shortlisted Candidates</option>
                            <option value={"Unshortlisted"} selected={(option==='Unshortlisted')}>Unshortlisted Candidates</option>
                        </select>
                    </div>
                </div>
                <div>
                {(option==='Shortlisted')?(job.shortlisted && job.shortlisted.length>0)?job.shortlisted.map((element,idx)=><div className="w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative" key={idx}>
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
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>unshortlist(element,1)}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Unshortlist</div>
                    </div>
                    </div>)
                :<div className="flex items-center justify-center font-semibold">No Applicants Shortlisted Yet...</div>:(option==='Unshortlisted')?(job.nonshortlisted && job.nonshortlisted.length>0)?job.nonshortlisted.map((element,idx)=><div className="w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative" key={idx}>
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
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank" onClick={()=>{navigate(`/recruiter/userprofile/${element.userInfo.userId}/${id}`,{state:{userinfo:element.userInfo}})}}>View Profile</a></div>
                    </div>
                </div>):<div className="flex items-center justify-center font-semibold">No Applicants Unshortlisted Yet...</div>:(job.pending && job.pending.length>0)?job.pending.map((element,idx)=><div className="w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative" key={idx}>
                    <div className="flex items-center gap-3">
                        <div className="w-[70px] h-[70px] rounded-full">
                            <img src={(element.userInfo.profileImg)?element.userInfo.profileImg:userAvatar} alt="icon" className="w-full h-full rounded-full border-2 border-purple-600"/>
                        </div>
                        <div className="font-semibold">
                            <div className="capitalize">{element.userInfo.fname+" "+element.userInfo.lname}</div>
                            <div>{element.userInfo.email}</div>
                        </div>   
                    </div>
                    <div className="w-full ">
                        <div className="w-full bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>{navigate(`/recruiter/userprofile/${element.userInfo.userId}/${id}`)}}>View Profile</div>
                        <div className="w-full flex gap-2">
                            <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>shortlist(element)}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Shortlist</div>
                            <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>unshortlist(element,0)}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Unshortlist</div>
                        </div>
                    </div>
                </div>):<div className="flex items-center justify-center font-semibold">No Pending Applications....</div>}
            </div>
            </div>
           </div>:<div className="flex items-center justify-center font-semibold">Loading....</div>}
        </div>
    )
}
export default MyJobPage;