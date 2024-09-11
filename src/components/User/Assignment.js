import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Questionnaire from "./Questionnaire";
import Analysis from "./Analysis";

function Assignment(){
    const [assignment,setassignment]=useState(null);
    const [status,setstatus]=useState(0); //0 means past, 1 means upcoming, 2 means started
    const [sol,setsol]=useState(null);
    const [time,settime]=useState(null);
    const navigate=useNavigate();
    const {id,id2}=useParams();
    const [assignendtime,setassignendtime]=useState(null);
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
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/applied/${id}/assignments/${id2}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        let assig=await JSON.parse(atob(msg.assignment));
                        let uid=storage.user_info.userId;
                        let solution=null;
                        if(assig.solutions && assig.solutions.length>0){
                            solution=assig.solutions.find((element)=>element.userId===uid);
                            setsol(solution);
                        }
                       
                        let currTime=new Date().getTime();
                        let assignmentstartTime=new Date(assig.assignmentdate).getTime();
                        let assignmentendTime=new Date(assignmentstartTime+(Number(assig.assignmentduration*60*60*1000))).getTime();
                        setassignendtime(assignmentendTime);
                        if(solution ||( assignmentendTime<currTime)){
                            setstatus(0);
                        }
                        else if(assignmentstartTime>currTime){
                            setstatus(1);
                            
                        }
                        else{
                            setstatus(2);
                        }
                        setassignment(assig);
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
                    toastId:"assignmenterror"
                });
            }
        }
        init();
    },[])
    useEffect(()=>{
        let interval;
        function init(){
        try{
            if(status===0 && assignment){
                clearInterval(interval);
                let newassignendtime=new Date((new Date(assignment.assignmentdate).getTime())+(Number(assignment.assignmentduration*60*60*1000))).getTime();
                setassignendtime(newassignendtime);
                return;
            }
            
            else if(status===1 && assignment){
                interval=setInterval(()=>{
                    let now=new Date().getTime();
                    let t=new Date(assignment.assignmentdate).getTime()-now;
                    if(t<=0){
                        setstatus(2);
                    }
                    else{
                    let days = Math.floor(t/(1000*60*60*24));
                    let hours = Math.floor((t%(1000*60*60*24))/(1000*60*60));
                    let minutes = Math.floor((t%(1000*60*60))/(1000*60));
                    let seconds = Math.floor((t%(1000*60))/1000);
                    settime(days+" Days "+hours+" Hrs "+minutes+" Mins "+seconds+" Sec");
                    }
                },1000)
            }
        }
        catch(error){
            toast.error(error,{
                toastId:"assignmenterror"
            });
        }
    }
    init();
    },[status])
    return(
        <div className="w-full h-full heading px-4 py-2 overflow-y-auto">
            {   
                (assignment)?<div>
                    {
                        (status===0)?<div className="relative">
                            
                            <div className="font-semibold text-xl text-purple-600">{assignment.assignmentname}</div>
                            <div className="flex gap-4 flex-wrap">
                            <div className="font-semibold my-3"><span className=" text-purple-600">Held On - </span>{new Date(assignment.assignmentdate).toLocaleString()}</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Duration - </span>{assignment.assignmentduration} Hrs</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Marks Per Question - </span>{assignment.assignmentmark}</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Negative Marking - </span>{(assignment.negativemarking)?"Yes":"No"}</div>
                            </div>
                          
                                {

                                    (assignment && assignendtime<(new Date().getTime()))?<div><Analysis assignment={assignment} sol={sol}/></div>:(assignendtime>=(new Date().getTime()))?<div className="absolute right-0 top-0 bg-purple-600 px-2 py-2 pl-4 rounded-l-full text-white font-semibold">Assignment Not Ended Yet</div>:<div className="absolute right-0 top-0 bg-purple-600 px-2 py-2 pl-4 rounded-l-full text-white font-semibold">Not Attempted</div>
                                }
                             </div>:(status===1)?<div>
                            <div>
                        <div className="font-semibold text-2xl my-2 text-purple-600">{assignment.assignmentname}</div>
                        <div className="flex gap-4 flex-wrap">
                            <div className="font-semibold my-3"><span className=" text-purple-600">Conducted On - </span>{new Date(assignment.assignmentdate).toLocaleString()}</div>
                            <div className="font-semibold my-3"><span className="text-purple-600">Duration - </span>{assignment.assignmentduration} Hrs</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Marks Per Question - </span>{assignment.assignmentmark}</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Negative Marking - </span>{(assignment.negativemarking)?"Yes":"No"}</div>
                            <div className="font-semibold my-3"><span className=" text-purple-600">Number Of Questions - </span>{assignment.questions.length}</div>
                            
                            {(time)?<div className="w-full flex flex-col justify-center my-4">
                            <div className="text-center text-lg font-semibold my-2">Assignment Will Start In</div>
                            <div className="text-center text-lg font-semibold my-2 bg-purple-600 px-2 py-2 pl-4 rounded-full text-white w-max self-center">{time}</div>
                            </div>:<></>}
                        </div></div></div>:<><Questionnaire id={id} id2={id2} assignment={assignment} setstatus={setstatus} sol={sol} setsol={setsol}/></>
                    }
                </div>:<div className="flex justify-center items-center font-bold">Loading.....</div>
            }
        </div>
    )
}
export default Assignment;