import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
function JobPage(){
    const [job,setjob]=useState(null);
    const{id}=useParams();
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
                        navigate('/org/hackathons')
                    }
                    else if(storage.user && storage.user.type==='Recruiter'){
                        navigate('/recruiter/jobs')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/user/profile');
                        }
                        else{
            
                    const resp=await fetch(`http://localhost:5000/job/applied/${id}`,{
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
    return(
        <div className="w-full h-full heading px-4 overflow-y-auto relative">
            {(job)?<div className="py-2 "><div>
                <div className="flex gap-3 items-center">
                <div className="font-semibold text-xl text-purple-600">{job.jobId.jobTitle}</div>
                </div>
                <div>By {job.jobId.organizer}</div>
            </div>
            <div className="absolute right-0 top-0 bg-purple-600 px-2 py-2 pl-4 rounded-l-full text-white font-semibold">{(job.isshortlisted===0)?"Pending":(job.isshortlisted===1)?"Shortlisted":"Not Shortlisted"}</div>
            {(job.isshortlisted===1)?<div className="flex gap-2">
                {(job.assignment && job.assignment.length>0)?<div className="bg-purple-600 px-2 py-1 my-2 hover:cursor-pointer rounded-full text-white font-semibold" onClick={()=>navigate(`/user/jobs/applied/${id}/assignments`,{state:{assignment:job.assignment}})}>My Assignments</div>:<></>}
                {(job.interview && job.interview.length>0)?<div className="bg-purple-600 px-2 py-1 my-2 hover:cursor-pointer rounded-full text-white font-semibold" onClick={()=>navigate(`/user/jobs/applied/${id}/interviews`,{state:{interview:job.interview}})}>My Interviews</div>:<></>}
            </div>:<></>}
            <div className="font-semibold text-purple-600">Description</div>
            <div className="break-all whitespace-pre-line">{job.jobId.description}</div>
            <div className="font-semibold text-purple-600">Application Deadline</div>
            <div>{new Date(job.jobId.appdeadline).toLocaleString()}</div>
            <div className="font-semibold text-purple-600">Salary</div>
            <div>{job.jobId.salary}</div>
            <div className="font-semibold text-purple-600">Job Location</div>
            <div>{job.jobId.location}</div></div>:<div className="w-full h-full flex justify-center items-center font-semibold">Loading......</div>
        }
        </div>
    )
}
export default JobPage;