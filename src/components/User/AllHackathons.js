import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function AllHackathons(){
    const [hackathons,setHackathons]=useState([]);
    const [dispIdx,setdispIdx]=useState(0);
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
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
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/hackathon/getallhackathons`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setHackathons(msg.hackathons);
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
    async function applyHackathon(){
        try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
                setshowSpinner(true);
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/hackathon/applyhackathon/${hackathons[dispIdx]._id}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                });
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    let cpyhackathons=[...hackathons];
                    cpyhackathons.splice(dispIdx,1);
                    setHackathons(cpyhackathons);
                    setdispIdx(0);
                    setshowSpinner(false);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw "Some Error Occured";
                }
            }
            else{
                navigate('/');
            }
        }
        catch(error){
            setshowSpinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-full">
        {(hackathons && hackathons.length>0)?<div className="w-full h-full flex">
            <div className="w-[20%] h-full border-r-2 border-r-slate-200 shadow overflow-y-auto text-purple-600">
            {(hackathons && hackathons.length>0)?hackathons.map((element,idx)=>
                <div className={`flex flex-col items-start px-2 py-2 heading border-b-2 border-b-slate-200 hover:cursor-pointer ${(idx===dispIdx)?"bg-purple-600 text-white shadow-inner shadow-slate-600":"bg-slate-100 text-purple-600"}`} onClick={()=>setdispIdx(idx)} key={idx}>
                    <div className="font-semibold break-all">{element.hackathonTitle}</div>
                    <div className="text-sm">By {element.organizer}</div>
                </div>
            ):<></>}
            </div>
            {(hackathons && hackathons.length>0 && dispIdx<hackathons.length)?<div className="w-[80%] h-full px-2 py-2 overflow-y-auto heading">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex gap-3 items-center">
                        <div className="font-semibold text-xl text-purple-600">{hackathons[dispIdx].hackathonTitle}</div>
                        {(hackathons[dispIdx].sameOrg)?<div className="rounded-full bg-slate-600 text-center px-2 py-1 text-white text-xs w-max">Same Organization</div>:<></>}
                        </div>
                        <div>By {hackathons[dispIdx].organizer}</div>
                    </div>
                    <div className="mr-3">
                        <button className="text-white bg-purple-600 px-2 py-1 rounded-full hover:cursor-pointer font-semibold disabled:cursor-not-allowed disabled:bg-purple-400" disabled={showSpinner} onClick={()=>{applyHackathon()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>:<></>}Apply</button>
                    </div>
                </div>
                <div className="font-semibold text-purple-600">Description</div>
                <div className="break-all">{hackathons[dispIdx].description}</div>
                <div className="font-semibold text-purple-600">Important Dates</div>
                <div className="flex gap-2 my-2">
                    <div className="w-1/2 bg-slate-100 px-2 py-2 rounded">
                        <div className="text-sm text-purple-600">Registration</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathons[dispIdx].regStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathons[dispIdx].regEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="w-1/2 bg-slate-100 px-2 py-2 rounded">
                        <div className="text-sm text-purple-600">Hackathon</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathons[dispIdx].hackStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathons[dispIdx].hackEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div className="font-semibold text-purple-600">Rules</div>
                <div>
                    <ul className="list-disc list-inside  marker:text-purple-600">
                        {hackathons[dispIdx].rules.map((element,idx)=><li className="break-all" key={idx}>{element}</li>)}
                    </ul>
                </div>
                <div className="font-semibold text-purple-600 mb-2">Prizes</div>
                <div className="w-full flex flex-wrap gap-2">
                    {hackathons[dispIdx].prizes.map((element,idx)=><div className="px-2 py-2 w-1/3 border-2 border-purple-600 rounded bg-purple-200" key={idx}>
                        <div className="font-semibold">{element.prizeTitle}</div>
                        <div className="text-sm break-all">{element.prizeDescription}</div>
                    </div>)}
                </div>
            </div>:<></>}
        </div>:<div className="w-full h-full flex items-center justify-center heading font-semibold">No Hackathon Is Live</div>}
        </div>
    )
}
export default AllHackathons;