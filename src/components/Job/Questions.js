import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import rightArrow from '../../images/rightArrowIcon.svg'
function Questions({setdisabled,setdata}){
    const navigate=useNavigate();
    const [questions,setquestions]=useState([]);
    const [selected,setselected]=useState(0);
    const [selectedquest,setselectedquest]=useState([]);
    useEffect(()=>{
        async function initializeStates(){
            try{
                let storage=localStorage.getItem('storage');
                storage=JSON.parse(storage);
                if(storage && storage.auth){
                    if(storage.user.type==='Candidate'){
                        navigate('/user/projects/')
                    }
                    else if(storage.user.type==='Organizer'){
                        navigate('/org/hackathons/');
                    }
                    else{
                        const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/questions`,{
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
                                "toastId":"questiontoast"
                            });
                            setquestions(msg.questions);
                        }
                        else if(msg && msg.error){
                            throw msg.error;
                        }
                        else{
                            throw 'Some Error Occured';
                        }
                    }
                }
                else{
                    navigate('/');
                }
            }
            catch(error){
                toast.error(error,{
                    "toastId":"questiontoast"
                });
            }
        }
        initializeStates();
    },[])
    useEffect(()=>{
        if(selectedquest.length>0){
            let questarr=[];
            selectedquest.forEach((element)=>questarr.push(questions[element]));
            setdata((prev)=>({...prev,questions:questarr}));
            setdisabled(false);
        }
        else{
            setdisabled(true);
        }
    },[selectedquest])
    function addAssignment(){
        try{
            let selectedcpy=[...selectedquest];
            selectedcpy.push(selected);
            setselectedquest(selectedcpy);
        }
        catch(error){
            toast.error(error);
        }
    }
    function removeAssignment(){
        try{
            let selectedcpy=[...selectedquest];
            let idx=selectedcpy.indexOf(selected);
            if(idx>=0){
                selectedcpy.splice(idx,1);
                setselectedquest(selectedcpy);
            }
        }
        catch(error){
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-max">
            {
                (questions && questions.length>0)?<div className="w-full h-full flex justify-center">
                    
                    <div className="p-4 overflow-y-auto w-[85%] bg-slate-300 rounded-xl flex gap-3 items-center justify-center relative">
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===0)} onClick={()=>setselected((prev)=>prev-1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full rotate-180"/>
                            </button>
                        </div>
                        <div className="w-[80%] flex flex-col items-center">
                        <div className="font-semibold text-2xl py-2 break-words text-left">{"Question "+ (selected+1)}</div>
                        <div className="font-semibold text-2xl py-2 break-words">{questions[selected].question}</div>
                        <div className="font-semibold text-xl w-full flex flex-col items-center">
                            {
                                questions[selected].options.map((element,idx)=><div className={`w-[50%] rounded mb-3 p-2 ${(element===questions[selected].correct_answer)?"border-2 border-green-600 text-white bg-green-600":"border-2 border-red-600"}`} key={idx}>{String.fromCharCode(65+idx)+". "+element}</div>)
                            }
                        </div>
                        {(selectedquest.indexOf(selected)===-1)?<div className="bg-purple-600 hover:cursor-pointer font-semibold text-white rounded-full p-2" onClick={()=>addAssignment()}>Add To Assignment</div>:
                        <div className="bg-purple-600 hover:cursor-pointer font-semibold text-white rounded-full p-2" onClick={()=>removeAssignment()}>Remove From Assignment</div>}
                        <div className="absolute top-0 right-0 bg-purple-600 font-semibold text-white p-2 rounded-xl">Selected Questions - {selectedquest.length}</div>
                        <div>
                        </div>
                        </div>
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===(questions.length-1))?true:false} onClick={()=>setselected((prev)=>prev+1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full"/>
                            </button>
                        </div>
                    </div>
                    
                    </div>:<div className="text-semibold flex items-center justify-center">Loading.....</div>
            }
        </div>
    )
}
export default Questions;