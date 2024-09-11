import { useState } from "react";
import Questions from './Questions'
import AssignmentForm from './AssignmentForm'
import rightArrow from '../../images/rightArrowIcon.svg'
import PublishAssignment from "./PublishAssignment";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
function Assignment(){
    const [screen,setscreen]=useState(1);
    const [disabled,setdisabled]=useState(true);
    const [data,setdata]=useState({});
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
    const {id}=useParams();
    async function publish(){
        try{
            setshowSpinner(true);
            let storage=localStorage.getItem('storage');
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
                let resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/createassignment/${id}`,{
                method:"post",
                mode:"cors",
                headers:{
                    "Content-Type": "application/json",
                    "authToken":storage.auth
                },
                body:JSON.stringify(data)
                });
                let msg=await resp.json();
                if(msg && msg.success){
                    setshowSpinner(false);
                    toast.success(msg.success);
                    navigate(`/recruiter/jobs/${id}`);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw 'Some Error Occured';
                }
            }
            
        }
        catch(error){
            setshowSpinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-full bg-slate-100 px-2 py-3 heading pb-0 relative flex flex-col">
            <div className="flex justify-center gap-3 h-[10%]">
                <div className={`p-2 flex gap-2 items-center font-semibold  ${(screen===1)?"text-purple-600":(screen>1)?"text-green-600":"text-slate-600"}`}><span className={`px-3 py-1 rounded-full border-4 ${(screen===1)?"border-purple-600":(screen>1)?"border-green-600":"border-slate-600"}`}>1</span>Select Questions</div>
                <div className={`p-2 flex gap-2 items-center font-semibold  ${(screen===2)?"text-purple-600":(screen>2)?"text-green-600":"text-slate-600"}`}><span className={`px-3 py-1 rounded-full border-4 ${(screen===2)?"border-purple-600":(screen>2)?"border-green-600":"border-slate-600"}`}>2</span>Fill The Details</div>
                <div className={`p-2 flex gap-2 items-center font-semibold  ${(screen===3)?"text-purple-600":"text-slate-600"}`}><span className={`px-3 py-1 rounded-full border-4 ${(screen===3)?"border-purple-600":"border-slate-600"}`}>3</span>Publish</div>
            </div>
            <div className="my-3">
                {
                    (screen===1)?<Questions setdisabled={setdisabled} setdata={setdata}/>:(screen===2)?<AssignmentForm setdisabled={setdisabled} setdata={setdata}/>:<PublishAssignment data={data}/>
                }
            </div>
            <div className="w-full flex-1">
            <div className="w-full h-full flex justify-center p-4 items-center">
                {(screen<3)?<button className={`font-semibold text-white bg-purple-600 p-3 rounded-full hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400`} disabled={disabled} onClick={()=>{setscreen((prev)=>prev+1); setdisabled(true)}}>
                    <div className="flex items-center gap-3">
                        <div>Proceed To Next Step</div>
                        <div><img src={rightArrow} alt="rightarrowicon"/></div>
                    </div>
                </button>:
                <button className={`font-semibold text-white bg-purple-600 p-3 rounded-full hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400`} disabled={false} onClick={()=>publish()}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>:<></>}
                    Publish Assignment
                </button>}
            </div>
            </div>
        </div>
    )
}
export default Assignment;