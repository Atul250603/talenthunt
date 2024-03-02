import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import rightArrowIcon from '../../images/rightArrowIcon.svg'
function MyAssignments(){
    const [assignments,setassignments]=useState(null);
    const {state}=useLocation();
    const navigate=useNavigate();
    const{id}=useParams();
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
                    else if(storage.user && storage.user.type==='User'){
                        navigate('/user/projects')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/recruiter/profile');
                        }
                        else{
                            if(state && state.assignment){
                                setassignments(state.assignments)
                            }
                            else{
                                const resp=await fetch(`http://localhost:5000/job/${id}/myassignments/`,{
                                    method:"POST",
                                    mode:"cors",
                                    headers:{
                                        "Content-Type": "application/json",
                                        "authToken":storage.auth
                                    }
                                })
                                const msg=await resp.json();
                                if(msg && msg.success){
                                    toast.success(msg.success,{
                                        toastId:"myassignmnets"
                                    })
                                    setassignments(msg.assignments);
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
                    toastId:"myassignmnets"
                });
            }
        }
        init();
    },[])
    return(
        <div className="w-full h-full heading px-4 py-2 overflow-y-auto">
            {
                (assignments && assignments.length>0)?assignments.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading hover:cursor-pointer' key={idx} onClick={()=>{navigate(`/recruiter/jobs/${id}/myassignments/${element.assignmentId}`)}}>
                <div className='text-xl font-semibold'>{element.assignmentname}</div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
            </div>):<div className="flex justify-center items-center font-semibold">Loading...</div>
            }
        </div>
    )
}
export default MyAssignments;