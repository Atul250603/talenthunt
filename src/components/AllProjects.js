import correctIcon from '../images/tickIcon.svg';
import closeIcon from '../images/redCloseIcon.svg';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
function AllProjects({allProjects,setallProjects}){
    const [swipe, setSwipe] = useState(2);
    const [disableBtn,setdisableBtn]=useState(false);
    const navigate=useNavigate(); 
    useEffect(()=>{
        async function init(){
            try{
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=JSON.parse(storage);
                if(storage && storage.auth){
                    const resp=await fetch("http://localhost:5000/project/allprojects",{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setallProjects(msg.projects);
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw "Some Error Occured";
                    }
    
                }
                else if(storage && !storage.auth){
                    navigate('/');
                }
            }
            catch(error){
                toast.error(error);
                navigate('/user/projects/');
            }
        }
        init();
    },[])
    async function applyProject(){
        try{
            if(allProjects.length>0){
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=JSON.parse(storage);
                let idx=allProjects.length-1;
                if(storage && storage.auth){
                    const resp=await fetch(`http://localhost:5000/project/applyproject/${allProjects[idx]._id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        toast.success("Successfully Applied",{autoClose:500});
                        setSwipe(1);
                        setdisableBtn(true);
                        setTimeout(()=>{
                            let tmpProject=[...allProjects];
                            tmpProject.splice(tmpProject.length-1,1);
                            setallProjects(tmpProject);
                            setSwipe(2);
                            setdisableBtn(false);
                        },500)
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw "Some Error Occured";
                    }
                }
                else if(storage && !storage.auth){
                    navigate('/');
                }
            }
        }
        catch(error){
            toast.error(error);
        }
    }
    async function rejectProject(){
        try{
            if(allProjects.length>0){
                let storage=localStorage.getItem('storage');
                if(!storage){
                    navigate('/');
                }
                storage=JSON.parse(storage);
                let idx=allProjects.length-1;
                if(storage && storage.auth){
                    const resp=await fetch(`http://localhost:5000/project/rejectproject/${allProjects[idx]._id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setSwipe(0);
                        setdisableBtn(true);
                        setTimeout(()=>{
                            let tmpProject=[...allProjects];
                            tmpProject.splice(tmpProject.length-1,1);
                            setallProjects(tmpProject);
                            setSwipe(2);
                            setdisableBtn(false);
                        },500)
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                        throw "Some Error Occured";
                    }
                }
                else if(storage && !storage.auth){
                    navigate('/');
                }
            }
        }
        catch(error){
            toast.error(error);
        }
    }
    return(
        <div className="heading h-full w-full mt-3">
            
            <div className="h-full w-full flex">
                <div className={`w-[10%] h-full flex items-center justify-center items-center ${(disableBtn)?"disabledDiv":""}`}>
                    <div className='w-[50%] hover:cursor-pointer' onClick={()=>{rejectProject()}}>
                        <img src={closeIcon} alt="icon" className='w-full h-full'/>
                    </div>
                </div>
                <div className="w-[80%] h-full font-semibold flex items-center justify-center relative">
                    {(allProjects && allProjects.length>0)?allProjects.map((element,idx)=>(idx===allProjects.length-1)?<div className={`w-full h-max bg-gradient-to-r from-purple-100 to-purple-300 rounded-xl px-3 py-3 text-black absolute ${(idx===(allProjects.length-1))?(swipe===0)?'slideLeft':(swipe===1)?'slideRight':'':''}`}key={idx}>
                        <div className='text-2xl '>{element.projectTitle}</div>
                        <div className='text-sm mt-1'>By {element.creator}</div>
                        {(element.sameOrg)?<div className='rounded-full bg-slate-600 text-center px-2 py-1 text-white text-xs w-max mt-2'>Same Organization Only</div>:<></>}
                        <div className='mt-2'>
                            <div className='text-lg'>Description</div>
                            <div className='text-medium mt-2 font-medium'>
                               { (element.description.length>300)?(<>{element.description.substring(0,299)}<NavLink to={`/user/projects/projectpage/${element._id}`} className="font-semibold underline">...more</NavLink></>):element.description}
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='text-lg'>Skills Required</div>
                            <div className='mt-2 w-full flex gap-2 flex-wrap'>
                                {(element.skills && element.skills.length>0)?element.skills.map((skill,idx)=><div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white text-xs' key={idx}>{skill}</div>):<>No Skills Added Yet....</>}
                            </div>
                        </div>
                    </div>:<></>):<div>Why Not You Post The First Project....</div>}
                </div>
                <div className={`w-[10%] h-full flex items-center justify-center items-center ${(disableBtn)?"disabledDiv":""}`}>
                    <div className='w-[50%] hover:cursor-pointer' onClick={()=>{applyProject()}}>
                        <img src={correctIcon} alt="icon" className='w-full h-full'/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AllProjects;