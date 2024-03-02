import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect,useState} from 'react';
import { toast } from 'react-toastify';
function ProjectPage(){
    const params=useParams();
    const navigate=useNavigate();
    const id=params.id;
    const {state}=useLocation();
    const [myProject,setmyProject]=useState();
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
            }
            }
            }
            else{
                navigate('/');
            }
        }
        catch(error){
            toast.error(error);
            navigate('/user/projects/appliedprojects');
        }
        }
        init();
    },[])
    return(
        <div className="heading h-full w-full mt-3 px-3 py-2">
          {(myProject)?<><div className='flex gap-2 items-center'><div className="text-purple-600 font-semibold text-2xl">{myProject.projectTitle}</div> {(myProject.sameOrg)?<div className='rounded-full bg-slate-600 text-center px-2 py-1 text-white text-xs'>Same Organization Only</div>:<></>}</div>
           <div className="my-3">
                <div className="text-purple-600 font-medium text-lg">Description</div>
                <div className="text-sm break-all whitespace-pre-line">{myProject.description}</div>
           </div>
           <div className="my-3">
                <div className="text-purple-600 font-medium text-lg">Skills Needed</div>
                <div className='mt-2 w-full flex gap-2 flex-wrap'>
                    {(myProject && myProject.skills && myProject.skills.length>0)?myProject.skills.map((element,idx)=><div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white text-xs' key={idx}>{element}</div>):<>No Skills Added......</>}
                </div>
           </div></>:<div>Loading......</div>}
        </div>
    )
}
export default ProjectPage;