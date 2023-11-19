import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import eventIcon from '../../images/eventIconFilled.svg';
import userIcon from '../../images/userIconFilled.svg';
import userAvatar from '../../images/userAvatar.png';
import crossIcon from '../../images/closeIcon.svg';
import trophyIcon from '../../images/trophyIcon.svg';
function MyHackathonPage(){
    const [hackathon,setHackathon]=useState(null);
    const [showPopup,setshowPopup]=useState(false);
    const [prizes,setPrizes]=useState(null);
    const [allotedPrize, setallotedPrize]=useState(null);
    const [user, setuser]=useState(null);
    const [showSpinner,setShowSpinner]=useState(false);
    const navigate=useNavigate();
    const {id}=useParams();
    useEffect(()=>{
        async function init(){
            try{
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=await JSON.parse(storage);
                if(storage && storage.auth){
                    const resp=await fetch(`http://localhost:5000/hackathon/myhackathon/${id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    })
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setHackathon(msg.hackathon);
                        setPrizes(msg.hackathon.hackathonId.prizes);
                        toast.success(msg.success,{
                            toastId:"hackathonId"
                        });
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
                toast.error(error,{
                    toastId:"hackathonId"
                });
                navigate('/org/hackathons');
            }
        }
        init();
    },[])
    function allotPrize(userId){
        try{
        if(!userId)return;
        setuser(userId);
        setshowPopup(true);
        }
        catch(error){
            toast.error(error);
        }
    }
    function closePopUp(){
        setshowPopup(false);
        setShowSpinner(false);
    }
    async function handoverprize(){
        try{
            setShowSpinner(true);
            if(!allotedPrize){
                throw "Select Prize To Hand Over";
            }
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=JSON.parse(storage);
            if(storage && storage.auth && user && allotedPrize){
                const resp=await fetch(`http://localhost:5000/hackathon/handoverprize/${id}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    },
                    body:JSON.stringify({
                        userId:user,
                        prize:allotedPrize
                    })
                })
                const msg=await resp.json();
                if(msg && msg.success){
                    let tmphackathon=[...hackathon];
                    for(let index=0;index<tmphackathon.submissions.length;index++){
                        if(String(tmphackathon.submissions[index].userId)===String(user)){
                            tmphackathon[index]={
                                ...tmphackathon.submissions[index],
                                prize:allotedPrize
                            }
                        }
                    }
                    setHackathon(tmphackathon);
                    toast.success(msg.success);
                    setShowSpinner(false);
                    setshowPopup(false);
                    setallotedPrize(null);
                    setuser(null);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw "Some Error Occured"
                }
            }
            else{
                navigate('/');
            }
        }
        catch(error){
            setShowSpinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-full bg-slate-100 px-2 py-3 heading pb-0">
            {(showPopup && prizes && prizes.length>0)?<div className="w-screen h-screen top-0 left-0 fixed flex items-center justify-center bg-black bg-opacity-75 z-30">
            <div className="w-1/2 max-h-max bg-white rounded-xl px-3 py-3">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-xl text-purple-600 heading font-semibold text-center'>Allot Prize</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-4 w-full h-full flex flex-col justify-center heading'>
                    <div className='w-full flex items-center'>
                        <div className='w-full flex my-4 gap-2'>
                            {(prizes && prizes.length>0)?prizes.map((element,idx)=><div className="min-w-[20%]" key={idx}>
                                <input type="radio" id={`prize ${idx}`} name="type" value={element.prizeTitle} className="hidden peer w-full" onChange={(e)=>{setallotedPrize(e.target.value)}}/>
                                <label htmlFor={`prize ${idx}`} className="flex items-center justify-center p-1 text-gray-500 bg-white border border-gray-400 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-purple-600 peer-checked:border-2 peer-checked:border-purple-600 peer-checked:text-purple-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                    <div>
                                        <div className="w-full text-md font-semibold">{element.prizeTitle}</div>        
                                    </div>
                                </label>
                            </div>):<></>}
                        </div>
                    </div>
                    <div className='w-full mt-4 flex justify-center'>
                        <button className='bg-purple-600 text-white w-max px-2 py-2 rounded-xl heading font-semibold text-sm' onClick={()=>{handoverprize()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Hand Over The Prize</button>
                    </div>
                </div>
            </div>
        </div>:
            (hackathon)?<div className="w-full h-full px-2 overflow-y-auto pb-2">
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-semibold text-purple-600 text-2xl">{hackathon.hackathonId.hackathonTitle}</div>
                    <div>{hackathon.hackathonId.organizer}</div>  
                </div>
            </div>   

            <div className="font-semibold text-purple-600">Description</div>
            <div className="break-all text-sm">{hackathon.hackathonId.description}</div>
            <div className="font-semibold text-purple-600">Important Dates</div>
                <div className="flex gap-2 my-2">
                    <div className="w-1/2 bg-slate-300 px-2 py-2 rounded-xl">
                        <div className="text-sm text-purple-600 font-semibold">Registration</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathon.hackathonId.regStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathon.hackathonId.regEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="w-1/2 bg-slate-300 px-2 py-2 rounded-xl">
                        <div className="text-sm text-purple-600 font-semibold">Hackathon</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathon.hackathonId.hackStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathon.hackathonId.hackEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div className="font-semibold text-purple-600">Rules</div>
                <div>
                    <ul className="list-disc list-inside  marker:text-purple-600">
                        {hackathon.hackathonId.rules.map((element,idx)=><li className="break-all text-sm" key={idx}>{element}</li>)}
                    </ul>
                </div>
                <div className="font-semibold text-purple-600">Prizes</div>
                <div className="w-full flex flex-wrap gap-2 my-2">
                    {hackathon.hackathonId.prizes.map((element,idx)=><div className="px-2 py-2 w-1/3 bg-slate-300 rounded-xl" key={idx}>
                        <div className="font-semibold text-purple-600">{element.prizeTitle}</div>
                        <div className="text-sm break-all">{element.prizeDescription}</div>
                    </div>)}
                </div>
                <div className="font-semibold text-purple-600">Participants</div>
                <div className="flex w-3/4 gap-2 mt-2">
                    <div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                        <div className="w-[9%]">
                            <img src={userIcon} alt="icon" className="w-full"/>
                        </div>
                        <div className="font-semibold">
                            <div className="text-purple-600 text-sm">Total Users Applied</div>
                            <div>{hackathon.applied.length}</div>
                        </div>
                    </div>
                    <div className="w-1/2 px-2 py-2 rounded-xl flex gap-3 items-center bg-slate-300">
                        <div className="w-[9%]">
                            <img src={eventIcon} alt="icon" className="w-full"/>
                        </div>
                        <div className="font-semibold">
                            <div className="text-purple-600 text-sm">Total Users Attempted</div>
                            <div>{hackathon.submissions.length}</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 w-full flex flex-wrap gap-2">
                    {(hackathon.submissions && hackathon.submissions.length>0)?hackathon.submissions.map((element,idx)=><div className="w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative" key={idx}>
                        <div className="flex items-center gap-3">
                            <div className="w-[70px] h-[70px] rounded-full">
                                <img src={(element.userInfo.profileImg)?element.userInfo.profileImg:userAvatar} alt="icon" className="w-full h-full rounded-full border-2 border-purple-600"/>
                            </div>
                            <div className="font-semibold">
                                <div className="capitalize">{element.userInfo.fname+" "+element.userInfo.lname}</div>
                                <div>{element.userInfo.email}</div>
                            </div>   
                        </div>
                        <div className="flex w-full gap-2 items-center justify-center">
                        <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm"><a href={element.link} target="_blank">View Submission</a></div>
                        {(!element.prize)?<div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>{allotPrize(element.userInfo.userId)}}>Allot Prize</div>:<div className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded-tl-full rounded-bl-full text-white font-semibold absolute top-0 right-0 shadow-xl">
                            <div><img src={trophyIcon} alt="icon"/></div>
                            <div>{element.prize}</div>
                        </div>}
                        </div>
                    </div>):<></>}
                </div>
           </div>:<div className="flex items-center justify-center font-semibold">Loading....</div>}
        </div>
    )
}
export default MyHackathonPage;