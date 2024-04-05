import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import rightArrowIcon from '../../images/rightArrowIcon.svg'
function MyInterviews(){
    const [interviews,setinterviews]=useState(null);
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
                        navigate('/org/hackathons/')
                    }
                    else if(storage.user && storage.user.type==='User'){
                        navigate('/user/projects/')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/recruiter/profile/');
                        }
                        else{
                            if(state && state.interviews){
                                let interview=state.interviews;
                                for(let i=0;i<interview.length;i++){
                                    let future=new Date(interview[i].interviewdate).getTime()>new Date().getTime();
                                    interview[i]={...interview[i],future};
                                }
                                setinterviews(interview)
                            }
                            else{
                                const resp=await fetch(`http://localhost:5000/job/${id}/myinterviews/`,{
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
                                        toastId:"myinterviews"
                                    })
                                    let interview=msg.interviews;
                                for(let i=0;i<interview.length;i++){
                                    let future=new Date(interview[i].interviewdate).getTime()>new Date().getTime();
                                    interview[i]={...interview[i],future};
                                }
                                    setinterviews(interview);
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
                (interviews && interviews.length>0)?interviews.map((element,idx)=>(element.future)?<div className="rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading bg-slate-400 hover:cursor-not-allowed" key={idx}>
                <div className='text-xl font-semibold'>
                    {element.interviewname}
                    <span className="text-sm bg-red-600 p-1 ml-2 rounded-full">Room Hasn't Started Yet</span>
                </div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
               
            </div>:<div className="rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading bg-slate-600 hover:cursor-pointer" key={idx} onClick={()=>{navigate(`/interview/${id}/${element.roomId}`)}}>
                <div className='text-xl font-semibold'>
                    {element.interviewname}
                </div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
               
            </div>):<div className="flex justify-center items-center font-semibold">Loading...</div>
            }
        </div>
    )
}
export default MyInterviews;