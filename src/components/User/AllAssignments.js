import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import rightArrowIcon from '../../images/rightArrowIcon.svg'
import { toast } from "react-toastify";

function AllAssignments(){
    const [pastassignments,setpastassignments]=useState(null);
    const [upcomingassignments,setupcomingassignments]=useState(null);
    const navigate=useNavigate();
    const {state}=useLocation();
    const {id}=useParams();
    const [selected,setselected]=useState();
    const [option,setoption]=useState("upcoming")
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
                            if(state && state.assignment){
                                let upcoming=[];
                                let past=[];
                                for(let i=0;i<state.assignment.length;i++){
                                    if(state.assignment[i].date && state.assignment[i].duration){
                                        let date=new Date(state.assignment[i].date);
                                        date=new Date(date.getTime()+ (Number(state.assignment[i].duration*60*60*1000))).getTime();
                                        if(date>=(new Date().getTime())){
                                            upcoming.push(state.assignment[i]);
                                        }
                                    else{
                                        past.push(state.assignment[i]);
                                    }
                                        
                                    }
                                }
                                setpastassignments(past);
                                setupcomingassignments(upcoming);
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
                    console.log(msg)
                    if(msg && msg.success){
                        let upcoming=[];
                                let past=[];
                                for(let i=0;i<msg.job.assignment.length;i++){
                                    if(msg.job.assignment[i].date && msg.job.assignment[i].duration){
                                    let date=new Date(msg.job.assignment[i].date);
                                    date=new Date(date.getTime()+ (Number(msg.job.assignment[i].duration*60*60*1000))).getTime();
                                    if(date>=(new Date().getTime())){
                                        upcoming.push(msg.job.assignment[i]);
                                    }
                                    else{
                                        past.push(msg.job.assignment[i]);
                                    }
                                        
                                    }
                                }
                                setpastassignments(past);
                                setupcomingassignments(upcoming);
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
                toast.error(error);
            }
        }
        init();
    },[])
    return(
        <div className="w-full h-full heading px-4 py-2 overflow-y-auto">
            {
                <div>
                    <div className="flex justify-between mb-3">
                    <div className="text-2xl font-semibold text-purple-600">My Assignments</div>
                    <div>
                        <select className="bg-slate-300 outline-none px-2 py-1 rounded-full" onChange={(e)=>setoption(e.target.value)}>
                            <option selected={(option==="upcoming"?true:false)} value="upcoming">Upcoming Assignments</option>
                            <option selected={(option==="past"?true:false)} value="past">Past Assignments</option>
                        </select>
                    </div> 
                    </div>
                    <div>
                        {
                            (option==="upcoming")?(upcomingassignments && upcomingassignments.length>0)?upcomingassignments.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading hover:cursor-pointer' key={idx} onClick={()=>{navigate(`/user/jobs/applied/${id}/assignments/${element.assignmentId}`)}}>
                                <div className='text-xl font-semibold'>{element.assignmentname}</div>
                                <div>
                                    <img src={rightArrowIcon} alt="icon"/>
                                </div>
                            </div>):<div className="font-semibold text-center">No Upcoming Assignments</div>:(pastassignments && pastassignments.length>0)?pastassignments.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading hover:cursor-pointer' key={idx} onClick={()=>{navigate(`/user/jobs/applied/${id}/assignments/${element.assignmentId}`)}}>
                                <div className='text-xl font-semibold'>{element.assignmentname}</div>
                                <div>
                                    <img src={rightArrowIcon} alt="icon"/>
                                </div>
                            </div>):<div className="font-semibold text-center">No Past Assignments</div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
export default AllAssignments;