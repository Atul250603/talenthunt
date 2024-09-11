import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function AllJobs(){
    const [jobs,setjobs]=useState([]);
    const [dispIdx,setdispIdx]=useState(0);
    const [showSpinner,setshowSpinner]=useState(false);
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
                    if(storage.user && storage.user.type==='Organizer'){
                        navigate('/org/jobs')
                    }
                    else if(storage.user && storage.user.type==='Recruiter'){
                        navigate('/recruiter/jobs')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/user/profile');
                        }
                        else{
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/getalljobs`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setjobs(msg.jobs);
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
                toast.error(error);
            }
        }
        init();
    },[])
    async function applyHackathon(){
        try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
                setshowSpinner(true);
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/applyjob/${jobs[dispIdx]._id}`,{
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
                    let cpyjobs=[...jobs];
                    cpyjobs.splice(dispIdx,1);
                    setjobs(cpyjobs);
                    setdispIdx(0);
                    setshowSpinner(false);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw "Some Error Occured";
                }
            }
            else{
                navigate('/');
            }
        }
        catch(error){
            setshowSpinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-full">
        {(jobs && jobs.length>0)?<div className="w-full h-full flex">
            <div className="w-[20%] h-full border-r-2 border-r-slate-200 shadow overflow-y-auto text-purple-600">
            {(jobs && jobs.length>0)?jobs.map((element,idx)=>
                <div className={`flex flex-col items-start px-2 py-2 heading border-b-2 border-b-slate-200 hover:cursor-pointer ${(idx===dispIdx)?"bg-purple-600 text-white shadow-inner shadow-slate-600":"bg-slate-100 text-purple-600"}`} onClick={()=>setdispIdx(idx)} key={idx}>
                    <div className="font-semibold break-all">{element.jobTitle}</div>
                    <div className="text-sm">By {element.organizer}</div>
                </div>
            ):<></>}
            </div>
            {(jobs && jobs.length>0 && dispIdx<jobs.length)?<div className="w-[80%] h-full px-2 py-2 overflow-y-auto heading">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex gap-3 items-center">
                        <div className="font-semibold text-xl text-purple-600">{jobs[dispIdx].jobTitle}</div>
                        </div>
                        <div>By {jobs[dispIdx].organizer}</div>
                    </div>
                    <div className="mr-3">
                        <button className="text-white bg-purple-600 px-2 py-1 rounded-full hover:cursor-pointer font-semibold disabled:cursor-not-allowed disabled:bg-purple-400" disabled={showSpinner} onClick={()=>{applyHackathon()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>:<></>}Apply</button>
                    </div>
                </div>
                <div className="font-semibold text-purple-600">Profile Match Score</div>
                <div className='mt-2 w-3/4 flex gap-2 flex-wrap'>
                                <div className='w-[100%] h-full rounded-xl bg-slate-600'>
                                    <div className={`h-[30px] font-semibold rounded-xl min-w-[10%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center p-2 flex items-center justify-center text-white`} style={{width:String(Math.round(Number(jobs[dispIdx].similarity)))+"%"}}>{(Number(jobs[dispIdx].similarity)).toFixed(2)+ " %"}</div>
                                </div>
                            </div>
                <div className="font-semibold text-purple-600">Description</div>
                <div className="break-all whitespace-pre-line">{jobs[dispIdx].description}</div>
                <div className="font-semibold text-purple-600">Application Deadline</div>
                <div>{new Date(jobs[dispIdx].appdeadline).toLocaleString()}</div>
                <div className="font-semibold text-purple-600">Salary</div>
                <div>Rs. {jobs[dispIdx].salary}</div>
                <div className="font-semibold text-purple-600">Job Location</div>
                <div>{jobs[dispIdx].location}</div>
                
            </div>:<div className="w-full h-full flex items-center justify-center heading font-semibold">No Job Is Live</div>}
        </div>:<div className="w-full h-full flex items-center justify-center heading font-semibold">Loading...</div>}
        </div>
    )
}
export default AllJobs;