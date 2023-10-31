import { useLocation, useNavigate, useParams } from 'react-router-dom';
import rightArrowIcon from '../images/rightArrowIcon.svg';
import userAvatar from '../images/userAvatar.png';
import { useEffect,useState} from 'react';
import { toast } from 'react-toastify';
function MyProjectPage(){
    const params=useParams();
    const navigate=useNavigate();
    const id=params.id;
    const [btnClick,setbtnClick]=useState(false);
    const [pending,setPending]=useState([]);
    const [accepted,setAccepted]=useState([]);
    const {state}=useLocation();
    const [myProject,setmyProject]=useState();
    useEffect(()=>{
        async function init(){
            try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=JSON.parse(storage);
            if(storage && storage.auth){
                if(!state || !state.myproject){
                    const resp=await fetch(`http://localhost:5000/project/myproject/${id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setmyProject(msg.project);
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                       throw "Some Error Occured";
                    }
                }
                else{
                    setmyProject(state.myproject);
                }
                const resp1=await fetch(`http://localhost:5000/project/pending/${id}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                })
                const msg1=await resp1.json();
                const resp2=await fetch(`http://localhost:5000/project/accepted/${id}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                })
                const msg2=await resp2.json();
                if(msg1 && msg1.success && msg2 && msg2.success){
                    setPending(msg1.pending);
                    setAccepted(msg2.accepted);
                }
                else if(msg1 && msg1.error){
                    throw msg1.error;
                }
                else if(msg2 && msg2.error){
                    throw msg2.error;
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
            navigate('/user/projects/myprojects');
        }
        }
        init();
    },[])
    return(
        <div className="heading h-full w-full mt-3 px-3 py-2">
          {(myProject)?<><div className='flex gap-2 items-center'><div className="text-purple-600 font-semibold text-2xl">{myProject.projectTitle}</div> {(myProject.sameOrg)?<div className='rounded-full bg-slate-600 text-center px-2 py-1 text-white text-xs'>Same Organization Only</div>:<></>}</div>
           <div className="my-3">
                <div className="text-purple-600 font-medium text-lg">Description</div>
                <div className="text-sm">{myProject.description}</div>
           </div>
           <div className="my-3">
                <div className="text-purple-600 font-medium text-lg">Skills Needed</div>
                <div className='mt-2 w-full flex gap-2 flex-wrap'>
                    {(myProject && myProject.skills && myProject.skills.length>0)?myProject.skills.map((element,idx)=><div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white text-xs' key={idx}>{element}</div>):<>No Skills Added......</>}
                </div>
           </div>
           <div className="flex mt-4 items-center justify-stretch w-full gap-2 overflow-hidden">
                <div className="flex-col w-1/4">
                     <div className={`w-full bg-purple-600 px-2 py-2 rounded-lg my-2 text-center ${(btnClick)?"bg-slate-300 text-black ":"text-white"} hover:cursor-pointer` } onClick={()=>setbtnClick(false)}>Pending Requests</div>
                     <div className={`w-full bg-purple-600 px-2 py-2 rounded-lg my-2 text-center ${(!btnClick)?"bg-slate-300 text-black ":"text-white"}  hover:cursor-pointer`} onClick={()=>setbtnClick(true)}>Accepted Requests</div>
                </div>
                <div className="w-3/4 bg-slate-200 h-[120px] rounded-lg px-3 py-2 overflow-y-auto snap-y ">
                    {(!btnClick && pending && pending.length>0)?pending.map((element,idx)=><div className='h-full flex justify-between items-center snap-center hover:cursor-pointer' key={idx} onClick={()=>navigate(`u/${element.userId}`,{state:{...state,userinfo:element}})}>
                        <div className='flex items-center gap-4 h-full'>
                            <div className='w-[70px] h-[70px]'><img src={(element.profileImg)?element.profileImg:userAvatar} alt="icon" className='w-full h-full border-2 border-purple-600 rounded-full'/></div>
                            <div className='font-semibold'>{element.fname[0].toUpperCase()+element.fname.substring(1,element.fname.length) + " "+ element.lname[0].toUpperCase()+element.lname.substring(1,element.lname.length)}</div>
                        </div>
                        <div className='h-full flex items-center blackSvg'><img src={rightArrowIcon} alt="icon"/></div>
                    </div>):(!btnClick)?<div className='h-full w-full flex items-center justify-center'>No Pending Requests Yet....</div>:(btnClick && accepted && accepted.length>0)?accepted.map((element,idx)=><div className='h-full flex justify-between items-center snap-center hover:cursor-pointer' key={idx}  onClick={()=>navigate(`/user/chat/${id}/${element.userId}`,{state:{...state,userinfo:element}})}>
                        <div className='flex items-center gap-4 h-full'>
                            <div className='w-[70px] h-[70px]'><img src={(element.profileImg)?element.profileImg:userAvatar} alt="icon" className='w-full h-full border-2 border-purple-600 rounded-full'/></div>
                            <div className='font-semibold'>{element.fname[0].toUpperCase()+element.fname.substring(1,element.fname.length) + " "+ element.lname[0].toUpperCase()+element.lname.substring(1,element.lname.length)}</div>
                        </div>
                        <div className='h-full flex items-center blackSvg'><img src={rightArrowIcon} alt="icon"/></div>
                    </div>):(btnClick)?<div className='h-full w-full flex items-center justify-center'>No Accepted Requests Yet</div>:<div className='h-full w-full items-center justify-center flex'>No Data Available</div>}
                </div>
           </div></>:<div>Loading......</div>}
        </div>
    )
}
export default MyProjectPage;