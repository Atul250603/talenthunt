import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Jobs(){
    return(
        <div className="w-full h-screen bg-slate-100 flex">
            <div className="w-[89%] bg-white rounded-xl my-2 relative left-[10%] flex flex-col">
                <div className="text-xl text-purple-600 font-bold border-b-2 border-b-slate-300 flex gap-4 heading px-3 items-center py-3">
                    <div>
                        <NavLink  to="/user/jobs/" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2" : "text-slate-400 py-3 px-2")}>Jobs</NavLink>
                    </div>
                    <div>
                         <NavLink  to="/user/jobs/applied" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2" : "text-slate-400 py-3 px-2")}>Applied Jobs</NavLink>
                    </div>
                </div>
                <div className="w-full flex-1 overflow-y-hidden">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
export default Jobs;
