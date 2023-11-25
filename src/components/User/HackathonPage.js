import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {auth,storage} from '../../firebase.config';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {uid} from 'uid';
import trophyIcon from '../../images/trophyIcon.svg';
function HackathonPage(){
    const [hackathon,setHackathon]=useState(null);
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
    const {id}=useParams();
    const [link,setLink]=useState(null);
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
                    const resp=await fetch(`http://localhost:5000/hackathon/getHackathon/${id}`,{
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
                        if(msg.hackathon.submissionStatus){
                            setLink(msg.hackathon.link);
                        }
                    }
                    else if(msg&& msg.error){
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
                navigate('/user/hackathons/applied');
            }
        }
        init();
    },[])
    async function recordScreen(){
        try{
        return await navigator.mediaDevices.getDisplayMedia({
            audio: true, 
            video:true
        });
        }
        catch(error){
            toast.error("Error In Screen Recording",
            {
                toastId: 'screenrec',
            });
        }
    }
    function createRecorder (stream) {
        try{
            let recordedChunks = []; 
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (e) {
              if (e.data.size > 0) {
                recordedChunks.push(e.data);
              }  
            };
            mediaRecorder.onstop = function () {
               saveFile(recordedChunks);
               recordedChunks = [];
            };
            mediaRecorder.start();
            return mediaRecorder;
        }
        catch(error){
            toast.error("Error In Screen Recording",
            {
                toastId: 'screenrec',
            });
        }
    }
   async function saveFile(recordedChunks){
        try{
            setshowSpinner(true);
            const blob = new Blob(recordedChunks, {
               type: 'video/mp4'
            });
            let uniqueid=uid(32);
            const submissionRef=ref(storage,`hackathon_submissions/${uniqueid+"submissions.mp4"}`);
            const submissionResp=await uploadBytes(submissionRef,blob);
            if(!submissionResp){
                throw "Error In Uploading The Recording";
            }
            let submissionDownloadLinkLocal=await getDownloadURL(submissionResp.ref);
            if(!(submissionDownloadLinkLocal.trim()).length){
                throw "Error In Generating The Recording Link";
            }
            let locstorage=localStorage.getItem('storage');
            if(!locstorage){
                navigate('/');
            }
            locstorage=JSON.parse(locstorage);
            if(!locstorage || !locstorage.auth){
                navigate('/');
            }
            const resp=await fetch(`http://localhost:5000/hackathon/submitSolution/${id}`,{
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type": "application/json",
                    "authToken":locstorage.auth
                },
                body:JSON.stringify({link:submissionDownloadLinkLocal})
            })
            const msg=await resp.json();
            if(msg && msg.success){
                toast.success(msg.success);
                setLink(submissionDownloadLinkLocal);
            }
            else if(msg && msg.error){
                throw msg.error;
            }
            else{
                throw "Some Error Occured";
            }
           setshowSpinner(false);
        }
        catch(error){
            setshowSpinner(false);
            toast.error(error,
            {
                toastId: 'screenrec',
            });
        }
     }
    async function onSubmitHandler(){
        try{
        let stream = await recordScreen();
        let mediaRecorder = createRecorder(stream);
        }
        catch(error){
            toast.error("Error In Screen Recording",
            {
                toastId: 'screenrec',
            });
        }
    }
    return(
        <div className="w-full h-full heading px-2 py-2 mb-4 pr-0">
           {(hackathon)?<div className="w-full h-full px-2 overflow-y-auto pb-2 relative">
                {
                    (hackathon.submissionStatus && hackathon.prize)?<div className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded-tl-full rounded-bl-full text-white font-semibold absolute top-0 right-0 shadow-xl">
                    <div><img src={trophyIcon} alt="icon"/></div>
                    <div>{hackathon.prize}</div>
                    </div>:<></>
                }
            <div className="flex justify-between items-center ">
                <div>
                    <div className="font-semibold text-purple-600 text-xl">{hackathon.hackathonId.hackathonTitle}</div>
                    <div>{hackathon.hackathonId.organizer}</div>  
                </div>
                <div className="mr-3">
                    {(!link)?(new Date(hackathon.hackathonId.hackStartDate).toLocaleDateString()<=new Date().toLocaleDateString() && new Date(hackathon.hackathonId.hackEndDate).toLocaleDateString()>new Date().toLocaleDateString())?<button className="bg-purple-600 text-white hover:cursor-pointer rounded-full px-2 py-1 disabled:cursor-not-allowed disabled:bg-purple-400" disabled={showSpinner} onClick={()=>{onSubmitHandler()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>:<></>}Submit Solution</button>:<></>:<></>}
                </div>
            </div>   
            {
                (link)?<div className="my-2"><div className="font-semibold text-purple-600">My Submission</div>
                <div className="w-1/2 my-2">
                    <video src={link} controls className="w-full rounded-xl shadow"/>
                </div>
                </div>:<></>
            }       
            <div className="font-semibold text-purple-600">Description</div>
            <div className="break-all">{hackathon.hackathonId.description}</div>
            <div className="font-semibold text-purple-600">Important Dates</div>
                <div className="flex gap-2 my-2">
                    <div className="w-1/2 bg-slate-100 px-2 py-2 rounded">
                        <div className="text-sm text-purple-600">Registration</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathon.hackathonId.regStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathon.hackathonId.regEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div className="w-1/2 bg-slate-100 px-2 py-2 rounded">
                        <div className="text-sm text-purple-600">Hackathon</div>
                        <div className="flex justify-between">
                            <div>Starts On - {new Date(hackathon.hackathonId.hackStartDate).toLocaleDateString()}</div>
                            <div>Ends On - {new Date(hackathon.hackathonId.hackEndDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                <div className="font-semibold text-purple-600">Rules</div>
                <div>
                    <ul className="list-disc list-inside  marker:text-purple-600">
                        {hackathon.hackathonId.rules.map((element,idx)=><li className="break-all" key={idx}>{element}</li>)}
                    </ul>
                </div>
                <div className="font-semibold text-purple-600">Prizes</div>
                <div className="w-full flex flex-wrap gap-2">
                    {hackathon.hackathonId.prizes.map((element,idx)=><div className="px-2 py-2 w-1/3 border-2 border-purple-600 rounded bg-purple-200" key={idx}>
                        <div className="font-semibold">{element.prizeTitle}</div>
                        <div className="text-sm break-all">{element.prizeDescription}</div>
                    </div>)}
                </div>
           </div>:<div className="flex items-center justify-center font-semibold">Loading....</div>}
        </div>
    )
}
export default HackathonPage;