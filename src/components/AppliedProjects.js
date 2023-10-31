import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import rightArrowIcon from '../images/rightArrowIcon.svg'
function AppliedProjects(){
    const [projects,setprojects]=useState(null);
    const [type,settype]=useState(0);
    const navigate=useNavigate();
    const {state}=useLocation();
    useEffect(()=>{
        async function init(){
            try{
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=JSON.parse(storage);
                if(storage && storage.auth){
                    const resp=await fetch(`http://localhost:5000/project/appliedProject`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setprojects(msg.projects);
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                       throw "Some Error Occured";
                    }
                }
            }
            catch(error){
                toast.error(error);
                navigate('/user/projects/');
            }
        }
        init();
    },[])
    return(
        <div className="heading h-full w-full mt-3 px-3 py-3">
            <div className="w-full flex font-semibold">
                <div className={`w-1/3 px-2 py-2 text-center border-2 border-red-600  rounded-l-full ${(type===0)?"bg-red-600 text-white shadow-inner shadow-red-900 ":'text-red-600'} hover:cursor-pointer`} onClick={()=>settype(0)}>Rejected</div>
                <div className={`w-1/3 px-2 py-2 text-center border-2 border-blue-600  border-l-0 border-r-0 ${(type===1)?'bg-blue-600 text-white shadow-inner shadow-blue-900':'text-blue-600'} hover:cursor-pointer`} onClick={()=>settype(1)}>Pending</div>
                <div className={`w-1/3 px-2 py-2 text-center border-2 border-green-600 rounded-r-full ${(type===2)?'bg-green-600 text-white shadow-inner shadow-green-900 ':'text-green-600'} hover:cursor-pointer`} onClick={()=>settype(2)}>Accepted</div>
            </div>
            {(projects && projects.length>0)?<div className="w-full my-3">
                {
                    (type===0)?projects.map((element,idx)=>(element.rejected)?<div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white hover:cursor-pointer' key={idx} onClick={()=>navigate(`/user/projects/projectpage/${element.projectId}`,{state:{...state,myproject:null}})}>
                    <div className='text-xl font-semibold'>{element.projectTitle}</div>
                    <div>
                        <img src={rightArrowIcon} alt="icon"/>
                    </div>
                    </div>:<></>):(type===1)?projects.map((element,idx)=>(element.pending)?<div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white hover:cursor-pointer' key={idx} onClick={()=>navigate(`/user/projects/projectpage/${element.projectId}`,{state:{...state,myproject:null}})}>
                    <div className='text-xl font-semibold'>{element.projectTitle}</div>
                    <div>
                        <img src={rightArrowIcon} alt="icon"/>
                    </div>
                    </div>:<></>):projects.map((element,idx)=>(element.accepted)?<div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white hover:cursor-pointer' key={idx} onClick={()=>navigate(`/user/chat/${element.projectId}/${element.user}`,{state:{...state,userinfo:null}})}>
                        <div className='text-xl font-semibold'>{element.projectTitle}</div>
                        <div>
                            <img src={rightArrowIcon} alt="icon"/>
                        </div>
                    </div>:<></>)
                }
            </div>:<div className="text-center h-full w-full flex items-center justify-center font-semibold"><div>Apply For Some Projects....</div></div>}
        </div>
    )
}
export default AppliedProjects;