import { useEffect, useState } from 'react';
import addIcon from '../../images/fillAddIcon.svg';
import HackathonForm from './HackathonForm';
import { useNavigate } from 'react-router-dom';
import rightArrowIcon from '../../images/rightArrowIcon.svg';
import { toast } from 'react-toastify';
function MyHackathon(){
    const [myProject,setmyProject]=useState([]);
    const [showProjectForm,setshowProjectForm]=useState(false);
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
                    if(storage.user && storage.user.type==='Candidate'){
                        navigate('/user/projects')
                    }
                    else if(storage.user && storage.user.type==='Recruiter'){
                        navigate('/recruiter/jobs')
                    }
                    else{
                        if(storage.user && !storage.user.profileCompleted){
                            navigate('/org/profile');
                        }
                        else{
                    const resp=await fetch("http://localhost:5000/hackathon/gethackathon",{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setmyProject(msg.hackathons);
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
                else if(storage && !storage.auth){
                    navigate('/');
                }
            }
            catch(error){
                toast.error(error,{
                    toastId:"hackathonerror"
                });
                navigate('/org/hackathons/');
            }
        }
        init();
    },[])
    return(
        <div className="w-full h-full bg-slate-100 px-4 py-2">
            {(showProjectForm)?<HackathonForm myProject={myProject} setmyProject={setmyProject} setshowProjectForm={setshowProjectForm}/>:<></>}
            {(myProject && myProject.length>0)?myProject.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white heading hover:cursor-pointer' key={idx} onClick={()=>navigate(`/org/hackathons/${element._id}`)}>
                <div className='text-xl font-semibold'>{element.hackathonTitle}</div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
            </div>):<div className='flex items-center h-full justify-center font-semibold heading'>Why Don't You Organize Hackathon.....</div>}
            <div className="h-[50px] w-[50-px] bg-white rounded-full fixed bottom-[30px] right-[30px]  hover:cursor-pointer shadow-lg shadow-slate-600 z-30 rounded-full" onClick={()=>setshowProjectForm(true)}>
                <img src={addIcon} alt="icon" className='w-full h-full'/>
            </div>
        </div>
    )
}
export default MyHackathon;