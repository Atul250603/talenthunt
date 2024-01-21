import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import eventIcon from '../../images/eventIconFilled.svg';
import userIcon from '../../images/userIconFilled.svg';
import userAvatar from '../../images/userAvatar.png';
import crossIcon from '../../images/closeIcon.svg';
import trophyIcon from '../../images/trophyIcon.svg';
function MyJobPage(){
    const [job,setjob]=useState({
        jobId:{
            jobTitle:"xyz",
            description:"sdfkhskfhksfhkshfkshfkhkfsdkfkshdf",
            organizer:"meeee",
            appdeadline:"2024-01-23T18:30:00.000+00:00",
            salary:"20000",
            location:"Delhi"
        },
        nonshortlisted:[],
        shortlisted:[]
    });
    const [option,setoption]=useState('Shortlisted');
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
                        navigate('/user/projects')
                    }
                    else if(storage.user && storage.user.type==='Organizer'){
                        navigate('/org/hackathons')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/recruiter/profile');
                        }
                        else{
                    // const resp=await fetch(`http://localhost:5000/job/myjob/${id}`,{
                    //     method:"POST",
                    //     mode:"cors",
                    //     headers:{
                    //         "Content-Type": "application/json",
                    //         "authToken":storage.auth
                    //     }
                    // })
                    // const msg=await resp.json();
                    // if(msg && msg.success){
                    //     setjob(msg.job);
                            // if(msg.job.shortlisted.length>0)setoption("Shortlisted");
                            // else setoption("Non Shortlisted");
                    //     toast.success(msg.success,{
                    //         toastId:"recruiterId"
                    //     });
                    // }
                    // else if(msg && msg.error){
                    //     throw msg.error;
                    // }
                    // else{
                    //     throw "Some Error Occured";
                    // }
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
    return(
        <div className="w-full h-full bg-slate-100 px-2 py-3 heading pb-0">
            {(job)?<div className="w-full h-full px-2 overflow-y-auto pb-2">
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-semibold text-purple-600 text-2xl">{job.jobId.jobTitle}</div>
                    <div>{job.jobId.organizer}</div>  
                </div>
                <div className="flex gap-2">
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer">Take Assignment</div>
                    <div className="bg-purple-600 text-white px-2 py-1 rounded-full hover:cursor-pointer">Schedule Interview</div>
                </div>
            </div>   

            <div className="font-semibold text-purple-600">Description</div>
            <div className="break-all text-sm">{job.jobId.description}</div>
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
            <div className="font-semibold text-purple-600">Participants</div>
            <div className="flex w-3/4 gap-2 mt-2">
                <div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                    <div className="w-[9%]">
                        <img src={userIcon} alt="icon" className="w-full"/>
                    </div>
                    <div className="font-semibold">
                        <div className="text-purple-600 text-sm">Total Users Applied</div>
                        <div>{job.nonshortlisted.length + job.shortlisted.length}</div>
                    </div>
                </div>
                <div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                    <div className="w-[9%]">
                        <img src={eventIcon} alt="icon" className="w-full"/>
                    </div>
                    <div className="font-semibold">
                        <div className="text-purple-600 text-sm">Total Users Shortlisted</div>
                        <div>{job.shortlisted.length}</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full w-100">
                <div className="w-100 flex justify-between">
                    <div className="font-semibold text-purple-600">{option} Candidates</div>
                    <div>
                        <span className="mr-3 text-purple-600 font-semibold">Filter</span>
                        <select className="bg-slate-300 outline-none p-1 rounded-full" onChange={(e)=>setoption(e.target.value)}>
                            <option value={"Shortlisted"} selected={(option==='Shortlisted')}>Shortlisted Candidates</option>
                            <option value={"Non Shortlisted"} selected={(option==='Non Shortlisted')}>Non Shortlisted Candidates</option>
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
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank">View Profile</a></div>
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank">Unshortlist</a></div>
                    </div>
                    </div>)
                :<div className="flex items-center justify-center font-semibold">No Applicants Shortlisted Yet...</div>:(job.nonshortlisted && job.nonshortlisted.length>0)?job.nonshortlisted.map((element,idx)=><div className="w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative" key={idx}>
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
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank">View Profile</a></div>
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank">Shortlist</a></div>
                    </div>
                </div>):<div className="flex items-center justify-center font-semibold">No One Has Applied Yet...</div>}
            </div>
            </div>
           </div>:<div className="flex items-center justify-center font-semibold">Loading....</div>}
        </div>
    )
}
export default MyJobPage;