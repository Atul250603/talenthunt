import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Peer } from "peerjs";
import {io} from 'socket.io-client';
import { uid } from "uid";
import msgIcon from '../images/msgIcon.svg'
import closeIcon from '../images/closeIcon.svg'
function InterviewRoom({socket}){
    const {jobId,roomId}=useParams();
    const navigate=useNavigate();
    const [remotepeer,setremotepeer]=useState(null);
    const [mypeerid,setmypeerid]=useState(null);
    const peer=useRef();
    const [usertype,setusertype]=useState(null);
    const myvideoref=useRef();
    const remotevideoref=useRef();
    const [showmsgIcon,setshowmsgIcon]=useState(true);
    const [chatmessages,setchatmessages]=useState([]);
    const [chat,setchat]=useState('');
    const autoscrollref=useRef();
    useEffect(()=>{
        async function init(){
            try{
            let storage=localStorage.getItem('storage');
            storage=await JSON.parse(storage);
            if(storage && storage.auth && storage.user && storage.user.profileCompleted && storage.user.type!=='Organizer'){
                let random_id=uid(32);
    
                const mypeer=new Peer(String(random_id), {
                    host: process.env.REACT_APP_PEER_URL,
                    port:443,
                    secure:true,
                    path: "/myapp",
                });
                if(!socket || !socket.current){
                    socket.current=io(process.env.REACT_APP_BACKEND_URL);
                }
                mypeer.on('open',(id)=>{
                    setmypeerid(id);
                })
                peer.current=mypeer;
                setusertype(storage.user.type);
            }
            else{
                navigate('/');
            }}
            catch(error){
                console.log(error);
                navigate('/')
            }
        }
        init();
    },[])
    useEffect(()=>{
        if(mypeerid){
            socket.current.emit('share-peer',{peerId:mypeerid,roomId:roomId});
        }
    },[mypeerid])
    function addremotepeer(data){
        socket.current.emit('share-my-peerid',{to:data.from,peerId:mypeerid});
       setremotepeer(data.peerId);
    }
    function addremotehistory(data){
        setremotepeer(data.peerId);
    }

    useEffect(()=>{
        if(usertype==='Recruiter' && remotepeer){
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            getUserMedia({ video: true, audio: true }, (mediaStream) => {
            myvideoref.current.srcObject = mediaStream;
            var playPromise = myvideoref.current.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                })
                .catch(error => {
                });
            }
            myvideoref.current.muted=true;
            const call = peer.current.call(remotepeer, mediaStream)
            call.on('stream', (remoteStream) => {
              remotevideoref.current.srcObject = remoteStream
             var playPromise = remotevideoref.current.play();;
            if (playPromise !== undefined) {
              playPromise.then(_ => {
              })
              .catch(error => {
              });}
        })
    })}
        else if(usertype==='Candidate' && remotepeer){
            peer.current.on('call', (call) => {
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                  myvideoref.current.srcObject = mediaStream;
                     var playPromise = myvideoref.current.play();
 
                    if (playPromise !== undefined) {
                      playPromise.then(_ => {
                       
                      })
                      .catch(error => {
                      });}

                  myvideoref.current.muted=true;
                  call.answer(mediaStream)
                  call.on('stream', function(remoteStream) {
                    remotevideoref.current.srcObject = remoteStream;
                     var playPromise = remotevideoref.current.play();
                    if (playPromise !== undefined) {
                      playPromise.then(_ => {
                      })
                      .catch(error => {
                      });}  
                    })
                })})}
    },[usertype,remotepeer])
    
    async function removeuser(data){
        if(myvideoref.current && myvideoref.current.srcObject){
            const stream=await myvideoref.current.srcObject;
            if(stream){
                stream.getTracks().forEach(async(track)=>await track.stop())
            }
        }
        if(remotevideoref.current && remotevideoref.current.srcObject){
            const stream=await remotevideoref.current.srcObject;
            if(stream){
            stream.getTracks().forEach(async(track)=>await track.stop())
            }
        }
        setremotepeer(null);
    }

    useEffect(()=>{
        if(socket.current){
            socket.current.on('remote-peer',addremotepeer);
            socket.current.on('remote-peer-history',addremotehistory);
            socket.current.on('user-disconnected',removeuser);
            socket.current.on('msg-received',messagereceived);
        }
        return ()=>{
            if(socket.current){
                socket.current.off('remote-peer',addremotepeer);
                socket.current.off('remote-peer-history',addremotehistory);
                socket.current.off('user-disconnected',removeuser);
                socket.current.off('msg-received',messagereceived);
            }
        }
    },[socket.current,mypeerid])
    function keyhandler(e){
        if(e.key==="Enter"){
           sendmessage();
        }
    }

    function sendmessage(){
        const message=chat;
        if(message.trim().length>0){
        socket.current.emit('send-msg',{room:roomId,message});
        let tempchatmsg=[...chatmessages];
        tempchatmsg.push({message,mine:true})
        setchatmessages(tempchatmsg);
        setchat('');
        }
    }

    function messagereceived({message}){
        setchatmessages((prev)=>[...prev,{message:message,mine:false}])
        setshowmsgIcon(false);
    }

    useEffect(()=>{
        const div = autoscrollref.current;
        if (div) {
          div.scrollIntoView({behaviour:"smooth"});
        }
    },[chatmessages])
    return(
        <div className="w-full h-screen heading px-4 py-2 overflow-hidden relative">
            <div className="bg-slate-300 text-purple-600 font-semibold text-xl p-2 rounded my-2">
                Interview Room
            </div>
            {(remotepeer)?<div className="flex w-full h-[90%] gap-2 justify-center items-center flex-1">
                <div className="w-max h-[70%] rounded-xl border-2 border-purple-600">
                    <div className="w-max h-full">
                        <div className="h-[90%]">
                        <video ref={myvideoref} className="w-max rounded-tl-xl rounded-tr-xl h-full"/>
                        </div>
                        <div className=" h-[10%] p-2 text-center font-semibold text-purple-600 bg-slate-300 rounded-bl-xl rounded-br-xl">My Feed</div>
                    </div>
                </div>
                <div className="w-max h-[70%] rounded-xl border-2 border-purple-600">
                    <div className="w-max h-full">
                        <div className="h-[90%]">
                        <video ref={remotevideoref} className="w-max rounded-tl-xl rounded-tr-xl h-full"/>
                        </div>
                        <div className="h-[10%] p-2 text-center font-semibold text-purple-600 bg-slate-300 rounded-bl-xl rounded-br-xl">Remote Feed</div>
                    </div>
                </div>
                <div className="bg-purple-600 w-[50px] h-[50px] p-2 rounded-full absolute right-4 bottom-4 hover:cursor-pointer" onClick={()=>{setshowmsgIcon(false)}}>
                    <img src={msgIcon} alt="msg-icon" className="w-full h-full"/>
                </div>
                <div className={`absolute right-0 top-0 h-screen w-1/4 bg-slate-300 p-2 shadow-2xl slide ${(!showmsgIcon)?"slideIn":"slideOut"}`}>
                        <div className="w-full h-[5%] flex justify-between items-center p-2 font-semibold border-b-2 border-b-purple-600">
                            <div className="text-purple-600">Chat Messages</div>
                            <div className="flex items-center hover:cursor-pointer" onClick={()=>setshowmsgIcon(true)}><img src={closeIcon} alt="close-icon"/></div>
                        </div>
                    <div className="h-[85%]">
                        <div className="h-full my-2 overflow-y-auto ">
                            {
                                (chatmessages && chatmessages.length>0)?chatmessages.map((element,idx)=><div className={`w-full flex my-1 ${(!element.mine)?"justify-start":"justify-end"}`} key={idx}><div className={`w-1/2 p-2 text-wrap break-all font-semibold rounded-xl ${(!element.mine)?"bg-slate-100 text-purple-600":"bg-purple-600 text-white mr-1"}`}>
                                    {element.message}
                                </div></div>):<></>
                            }
                        <div ref={autoscrollref}></div> 
                        </div>   
                    </div>
                    <div className="h-[10%] flex items-center relative">
                        <input type="text" name="msgbox" id="msgbox" value={chat} className="w-full h-1/2 border-2 border-purple-600 p-2" onChange={(e)=>setchat(e.target.value)} onKeyDown={(e)=>keyhandler(e)}/>
                    </div>
                </div>
            </div>:
            <div className="font-semibold h-[70%] flex items-center justify-center">
                There's No One In The Room...
            </div>
            }
        </div>
    )    
}
export default InterviewRoom;