import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import rightArrow from '../../images/rightArrowIcon.svg'
import Analysis from "./Analysis";
function MyAssignmentPage(){
    const [assignment,setassignment]=useState(null);
    const navigate=useNavigate();
    const {id,id2}=useParams();
    const [assignendtime,setassignendtime]=useState(null);
    const [selected,setselected]=useState(0);
    const [marks,setmarks]=useState(null);
    const [queststats,setqueststats]=useState(null);
    const[solutions,setsolutions]=useState(null);
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
                            navigate('/user/profile/');
                        }
                        else{
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/${id}/myassignments/${id2}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        let assig=msg.assignments;
                        let assignmentstartTime=new Date(assig.assignmentdate).getTime();
                        let assignmentendTime=new Date(assignmentstartTime+(Number(assig.assignmentduration*60*60*1000))).getTime();
                        if(assignendtime<=new Date().getTime() && assig.solutions && assig.solutions.length>0){
                            let tmpmarks=[];
                            let tmpqueststats=Array(assig.solutions.length).fill({status:[0,0,0],userId:null});
                            for(let i=0;i<assig.solutions.length;i++){
                                if(assig.solutions[i].userId && assig.solutions[i].userId.userId){
                                tmpmarks.push({totalmarks:assig.solutions[i].totalmarks,userId:assig.solutions[i].userId.userId});
                                for(let j=0;j<assig.solutions[i].solutions.length;j++){
                                    let val=[...tmpqueststats[i].status];
                                    if(assig.solutions[i].solutions[j].status==="Correct"){
                                        val[0]+=1;
                                        tmpqueststats[i].status=val;
                                    }
                                    else if(assig.solutions[i].solutions[j].status==="Not Attempted"){
                                        val[1]+=1;
                                        tmpqueststats[i].status=val;
                                    }
                                    else{
                                        val[2]+=1;
                                        tmpqueststats[i].status=val;
                                    }
                                    tmpqueststats[i].userId=assig.solutions[i].userId.userId;
                                }
                                }
                            }
                            setmarks(tmpmarks);
                            setqueststats(tmpqueststats);
                        }
                        setassignendtime(assignmentendTime);
                        setsolutions(assig.solutions);
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
    return(
        <div className="w-full h-full heading px-4 py-2 overflow-y-auto">
            {
                (assignment)?<div>
                            <div className="font-semibold text-2xl text-purple-600">{assignment.assignmentname}</div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="font-semibold my-3"><span className=" text-purple-600">Conducted On - </span>{new Date(assignment.assignmentdate).toLocaleString()}</div>
                                <div className="font-semibold my-3"><span className=" text-purple-600">Duration - </span>{assignment.assignmentduration} Hrs</div>
                                <div className="font-semibold my-3"><span className=" text-purple-600">Marks Per Question - </span>{assignment.assignmentmark}</div>
                                <div className="font-semibold my-3"><span className=" text-purple-600">Negative Marking - </span>{(assignment.negativemarking)?"Yes":"No"}</div>
                            </div>
                            <div className="p-4 overflow-y-auto w-full my-2 flex gap-3 items-center justify-center">
                <div className="w-full flex items-center bg-slate-300 rounded-xl py-3 relative">
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===0)} onClick={()=>setselected((prev)=>prev-1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full rotate-180"/>
                            </button>
                        </div>
                        <div className="w-[80%] flex flex-col items-center">
                        <div className="font-semibold text-2xl py-2 break-words text-left">{"Question "+ (selected+1)}</div>
                        <div className="font-semibold text-2xl py-2 break-words">{assignment.questions[selected].question}</div>
                        <div className="font-semibold text-xl w-full flex flex-col items-center">
                            {
                                assignment.questions[selected].options.map((element,idx)=><div className={`w-[50%] rounded mb-3 p-2  hover:cursor-pointer  ${(element===assignment.questions[selected].correct_answer)?"text-white bg-green-600 border-2 border-green-600":"border-2 border-purple-600"}`} key={idx}>{String.fromCharCode(65+idx)+". "+element}</div>)
                            }
                        </div>
                        </div>
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===(assignment.questions.length-1))?true:false} onClick={()=>setselected((prev)=>prev+1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full"/>
                            </button>
                        </div>
                    </div>
                    </div>
                    {
                        (assignendtime<=new Date().getTime() && solutions && solutions.length>0)?<div><Analysis solutions={solutions} marks={marks} queststats={queststats} setmarks={setmarks} setqueststats={setqueststats} setsolutions={setsolutions}/></div>:(assignendtime<=new Date().getTime())?<div className="flex justify-center items-center font-semibold">No Shortlisted Candidates Are There For Analysis</div>:<div className="flex justify-center items-center font-semibold">Assignment Is Not Yet Concluded....</div>
                    }
                </div>:<div className="flex justify-center items-center font-semibold">Loading....</div>
            }
        </div>
    )
}
export default MyAssignmentPage;