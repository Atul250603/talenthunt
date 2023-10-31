import userAvatar from '../images/userAvatar.png'
import sendIcon from '../images/sendIcon.svg'
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {io} from 'socket.io-client';
function Chat(){
    const navigate=useNavigate();
    const {pid,uid}=useParams();
    const [messages,setmessages]=useState(null);
    const [msg,setmsg]=useState('');
    const [data,setData]=useState(null);
    const socket=useRef();
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
                    if(!state || !state.userinfo){
                        const resp1=await fetch(`http://localhost:5000/project/getprofile/${uid}/p/${pid}`,{
                            method:"POST",
                            mode:"cors",
                            headers:{
                                "Content-Type": "application/json",
                                "authToken":storage.auth
                            }
                        });
                        const respmsg1=await resp1.json();
                        if(respmsg1 && respmsg1.success){
                            setData(respmsg1.user_info);
                        }
                        else if(respmsg1 && respmsg1.error){
                            throw respmsg1.error;
                        }
                        else{
                           throw "Some Error Occured";
                        }
                    }
                    else{
                        setData(state.userinfo);
                    }
                    const resp=await fetch(`http://localhost:5000/message/allmsg`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        },
                        body:JSON.stringify({
                            projectId:pid,
                            to:uid
                        })
                    });
                    const respmsg=await resp.json();
                    if(respmsg && respmsg.success){
                        if(!socket || !socket.current){
                            socket.current=io("http://localhost:5000");
                            socket.current.emit('adduser',respmsg.messages.uid); 
                        }
                        setmessages(respmsg.messages.messages);
                    }
                    else if(respmsg && respmsg.error){
                        throw respmsg.error;
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
            toast.error(error);
            navigate(`/user/projects/myprojects/${pid}`);
        }
        }
        init();
    },[])
    useEffect(()=>{
        if(socket && socket.current){
            socket.current.on('msgrcv',(rcvmsg)=>{
                setmessages((prev)=>[...prev,{message:rcvmsg,myself:false}])
            })
        }
    },[socket.current])
    function keychangehandler(e){
        if(e.key==="Enter"){
            sendMessage();
        }
    }
    async function sendMessage(){
        try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=JSON.parse(storage);
            if(storage && storage.auth){
                    if(!(msg.trim()).length){
                        throw "Message Can't Be Empty";
                    }
                    if(!socket || !socket.current){
                        throw "Error In Sending The Messages";
                    }
                    socket.current.emit('sendmsg',{
                        to:uid,
                        message:msg
                    })
                    const resp=await fetch(`http://localhost:5000/message/send`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        },
                        body:JSON.stringify({
                            projectId:pid,
                            to:uid,
                            message:msg
                        })
                    });
                    const msg1=await resp.json();
                    if(msg1 && msg1.success){
                        setmessages((prev)=>[...prev,{myself:true,message:msg}]);
                        setmsg('');
                    }
                    else if(msg1 && msg1.error){
                        throw msg1.error;
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
            toast.error(error);
        }
    }
    return(
        <div className="w-full h-screen overflow-y-hidden bg-slate-100 flex">
            <div className="w-[89%] bg-white rounded-xl my-2 relative left-[10%] flex-col">
                {(data)?<div className='w-full h-full'><div className="flex items-center gap-2 bg-slate-200 rounded-lg mx-2 my-2 px-2 py-2 h-max ">
                    <div className='w-[40px] h-[40px] border-2 border-purple-600 rounded-full'>
                        <img src={(data.profileImg)?data.profileImg:userAvatar} alt="user-icon" className='w-full h-full rounded-full'/>
                    </div>
                    <div className='capitalize font-semibold heading'>{data.fname +" "+data.lname}</div>
                </div>
                <div className="h-[72%] overflow-y-auto mx-2 py-2 font-semibold heading self-stretch hideScroll shadow-inner shadow-slate-300 px-2 rounded">
                    {(messages && messages.length>0)?messages.map((element,idx)=>{
                        if(element.myself){
                            return <div className='w-full flex items-center justify-end' key={idx}>
                                <div className='break-words w-[45%] my-2 bg-purple-600 text-white px-2 py-2 rounded-lg'>
                                   {element.message}
                                </div>
                             </div>
                        }
                        else{
                             return <div className='w-full flex items-center justify-start' key={idx}>
                                <div className='break-words w-[45%] my-2 bg-slate-200 text-purple-600 px-2 py-2 rounded-lg'>
                                    {element.message}
                                </div>
                             </div>
                        }
                    }):<div className='w-full h-full font-semibold flex items-center justify-center'>Why Not Start A Conversation....</div>
                    }
                </div>
                <div className="flex w-100 items-center justify-center mx-2 mt-2 h-max bg-slate-200 rounded-lg px-2 py-2 heading">
                    <div className='w-[95%] py-2'><input type="text" name="chatmsg" id="chatmsg" className='w-full px-1 py-1 outline-none bg-slate-200 placeholder:text-black' value={msg} onChange={(e)=>setmsg(e.target.value)} onKeyDown={(e)=>keychangehandler(e)} placeholder='Type Your Message Here....'/></div>
                    <div className='w-[5%] flex justify-center items-center py-2'><img src={sendIcon} alt="sendIcon" className='w-[20px] h-[20px] hover:cursor-pointer' onClick={()=>{sendMessage()}}/></div>
                </div></div>:<div className='w-full h-full font-semibold flex items-center justify-center'>Loading....</div>}
            </div>
        </div>
    )
}
export default Chat;