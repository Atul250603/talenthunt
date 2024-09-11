import { useEffect, useState } from "react";
import rightArrowIcon from '../../images/rightArrowIcon.svg'
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
function AppliedHackathons(){
    const [appliedHackathons,setappliedHackathons]=useState([]);
    const navigate=useNavigate();
    const {state}=useLocation();
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
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/user/profile');
                        }
                        else{
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/hackathon/applied`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setappliedHackathons(msg.hackathons);
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
                toast.error(error);
            }
        }
        init();
    },[])
    return(
        <div className="w-full h-full heading px-4">
            {(appliedHackathons && appliedHackathons.length>0)?appliedHackathons.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading hover:cursor-pointer' key={idx} onClick={()=>{navigate(`/user/hackathons/applied/${element.hackathonId._id}`)}}>
                <div className='text-xl font-semibold'>{element.hackathonId.hackathonTitle}</div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
            </div>):<div className='flex items-center h-full justify-center font-semibold heading'>Loading.....</div>}
        </div>
    )
}
export default AppliedHackathons;