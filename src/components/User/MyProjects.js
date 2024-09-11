import { useEffect } from 'react';
import rightArrowIcon from '../../images/rightArrowIcon.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function MyProjects({myProject,setmyProject}){
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
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/project/myprojects`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                });
                const msg=await resp.json();
                if(msg && msg.success){
                    setmyProject(msg.projects);
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
            toast.error(error);
            navigate('/user/projects/myprojects');
        }
        }

        init();
    },[])
    return(
        <div className="heading h-full w-full mt-3 px-3 py-3">
            {(myProject && myProject.length>0)?myProject.map((element,idx)=><div className='bg-slate-600 rounded-lg px-4 py-3 my-2 flex justify-between items-center text-white hover:cursor-pointer' key={idx} onClick={()=>navigate(`/user/projects/myprojects/${element._id}`,{state:{myproject:element}})}>
                <div className='text-xl font-semibold'>{element.projectTitle}</div>
                <div>
                    <img src={rightArrowIcon} alt="icon"/>
                </div>
            </div>):<div className='flex items-center h-full justify-center font-semibold'>Why Don't You List One Project.....</div>}
        </div>
    )
}
export default MyProjects;