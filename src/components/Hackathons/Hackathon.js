import { NavLink, Outlet, useNavigate } from "react-router-dom";
function Hackathon(){
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
    return(
        <div className="w-[100%] h-screen bg-white rounded-xl flex flex-col">
            <div className="text-xl text-purple-600 font-bold border-b-2 border-b-slate-300 flex gap-4 heading px-3 items-center py-3 justify-between">
                    <div className="flex gap-4">
                        <div>
                            <NavLink  to="/org/hackathons" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2" : "text-slate-400 py-3 px-2")}>My Hackathons</NavLink>
                        </div>
                        <div >
                             <NavLink  to="/org/profile" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2": "text-slate-400 py-3 px-2")}>My Profile</NavLink>
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
export default Hackathon;