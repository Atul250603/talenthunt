import { useEffect } from "react";
import { NavLink, useNavigate,Outlet } from "react-router-dom";
function Job(){
    const navigate=useNavigate();
    function logoutHandler(){
        try{
            localStorage.removeItem('storage');
            navigate('/');
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        async function initializeStates(){
            try{
                let storage=localStorage.getItem('storage');
                storage=JSON.parse(storage);
                if(storage && storage.auth && storage.user && storage.user.profileCompleted){
                    if(storage.user.type==='Candidate'){
                        navigate('/user/projects')
                    }
                    else if(storage.user.type==='Organizer'){
                        navigate('/org/hackathons');
                    }
                }
                else if(storage && storage.auth && storage.user && !storage.user.profileCompleted){
                    navigate('/recruiter/profile');
                }
                else{
                    navigate('/');
                }
            }
            catch(error){
                navigate('/');
            }
        }
        initializeStates();
    },[])
    return(
        <div className="w-[100%] h-screen bg-white rounded-xl flex flex-col">
            <div className="text-xl text-purple-600 font-bold border-b-2 border-b-slate-300 flex gap-4 heading px-3 items-center justify-between">
                    <div className="flex gap-4">
                        <div className="flex items-center">
                            <div className='text-purple-600 font-extrabold text-3xl brandname'>talentX</div>
                        </div>
                        <div className="h-[100%]">
                            <NavLink  to="/recruiter/jobs" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 block h-[100%] py-3 px-2" : "text-slate-400 h-[100%] block py-3 px-2")}>My Jobs</NavLink>
                        </div>
                        <div className="h-[100%]">
                             <NavLink  to="/recruiter/profile" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 block h-[100%] py-3 px-2": "text-slate-400 h-[100%] block py-3 px-2")}>My Profile</NavLink>
                        </div>
                    </div>
                    <div className="hover:cursor-pointer" onClick={()=>{logoutHandler()}}>
                        Logout
                    </div>
            </div>
            <div className="w-[100%] flex-1">
                <Outlet/>
            </div>
        </div>
    )
}
export default Job;