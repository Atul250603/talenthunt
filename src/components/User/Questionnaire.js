import { useEffect, useState } from "react";
import rightArrow from '../../images/rightArrowIcon.svg'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Questionnaire({id,id2,assignment,setstatus,sol,setsol}){
    const[selected,setselected]=useState(0);
    const [selectedans,setselectedans]=useState(null);
    const [time,settime]=useState(null);
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        function init(){
            if(assignment && assignment.questions && assignment.questions.length>0){
                setselectedans(Array(assignment.questions.length).fill(-1));
            }
        }
        function timerhandler(){
            if(assignment){
                setInterval(()=>{
                    let now=new Date().getTime();
                    let t=new Date((new Date(assignment.assignmentdate).getTime())+(Number(assignment.assignmentduration*60*60*1000))).getTime()-now;
                    if(t<=0){
                        //submit assignment call
                        submithandler();
                        setstatus(0);
                    }
                    else{
                    let hours = Math.floor((t%(1000*60*60*24))/(1000*60*60));
                    let minutes = Math.floor((t%(1000*60*60))/(1000*60));
                    let seconds = Math.floor((t%(1000*60))/1000);
                    settime(hours+" Hrs "+minutes+" Mins "+seconds+" Sec");
                    }
                },1000)
            }
        }
        init();
        timerhandler();
    },[])
    function selectoptionhandler(element){
        let tmpselectedans=[...selectedans];
        tmpselectedans[selected]=element;
        setselectedans(tmpselectedans);
    }
    async function submithandler(){
        try{
            setshowSpinner(true);
            let storage=localStorage.getItem('storage');
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
            let totalmarks=0;
            let solutions=[];
            for(let i=0;i<assignment.questions.length;i++){
                if(selectedans[i]!==-1 && assignment.questions[i].correct_answer===selectedans[i]){
                    totalmarks+=Number(assignment.assignmentmark);
                    solutions.push({questionId:assignment.questions[i]._id,status:"Correct",option:selectedans[i]});
                }
                else if(selectedans[i]===-1){
                    solutions.push({questionId:assignment.questions[i]._id,status:"Not Attempted",option:selectedans[i]});
                }
                else{
                    if(assignment.negativemarking){
                        totalmarks-=1;
                    }
                    solutions.push({questionId:assignment.questions[i]._id,status:"Wrong",option:selectedans[i]});
                }
            }
            let data={
                solutions,
                totalmarks
            }
            const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/applied/${id}/assignments/${id2}/submission`,{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type": "application/json",
                    "authToken":storage.auth
                },
                body: JSON.stringify(data)
            });
            const msg=await resp.json();
            if(msg && msg.success){
                setstatus(0);
                setsol(data);
                setshowSpinner(false);
            }
            else if(msg && msg.error){
                throw msg.error;
            }
            else{
                throw "Some Error Occurred";
            }
        }
        else{
            setshowSpinner(false);
            navigate('/');
        }
    }
        catch(error){
            setshowSpinner(false);
            toast.error(error,{
                toastId:"questionnaireerror"
            });
        }
    }
    return(
        <div className="w-full h-full heading px-4 py-2 overflow-y-auto">
            {(assignment && assignment.questions && assignment.questions.length>0 && time)?<div><div className="text-right"><span className="font-semibold bg-purple-600 text-white w-max px-2 py-1 rounded">Time Left - {time}</span></div>
            <div className="p-4 overflow-y-auto w-full my-2 flex gap-3 items-center justify-center">
                <div className="w-full flex items-center bg-slate-300 rounded-xl py-3">
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
                                assignment.questions[selected].options.map((element,idx)=><div className={`w-[50%] rounded mb-3 p-2 border-2 border-purple-600 hover:cursor-pointer  ${(element===selectedans[selected])?"text-white bg-purple-600":""}`} key={idx} onClick={()=>selectoptionhandler(element)}>{String.fromCharCode(65+idx)+". "+element}</div>)
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
                    <div className="w-full flex justify-center">
                    <button className="bg-purple-600 text-white hover:cursor-pointer rounded-full font-semibold px-3 py-2 disabled:cursor-not-allowed disabled:bg-purple-400" disabled={showSpinner} onClick={()=>{submithandler()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>:<></>}Submit Assignment</button>
                    </div>
                    </div>:<div className="text-center font-semibold">Loading......</div>}
        </div>
    )
}
export default Questionnaire;