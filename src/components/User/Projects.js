import { NavLink, Outlet } from "react-router-dom";
import {useState} from 'react'
import ProjectForm from './ProjectForm';
import addIcon from '../../images/fillAddIcon.svg';
function Projects({myProject,setmyProject}){
    const [showProjectForm, setshowProjectForm] = useState(false);
    return(
        <div className="w-full min-h-screen max-h-auto bg-slate-100 flex">
            {(showProjectForm)?<ProjectForm myProject={myProject} setmyProject={setmyProject} setshowProjectForm={setshowProjectForm}/>:<></>}
            <div className="w-[89%] bg-white rounded-xl my-2 relative left-[10%] flex-col">
                <div className="text-xl text-purple-600 font-bold border-b-2 border-b-slate-300 flex gap-4 heading px-3 items-center py-3">
                    <div>
                        <NavLink  to="/user/projects/" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2" : "text-slate-400 py-3 px-2")}>Projects</NavLink>
                    </div>
                    <div >
                         <NavLink  to="/user/projects/myprojects" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2": "text-slate-400 py-3 px-2")}>My Projects</NavLink>
                    </div>
                    <div>
                         <NavLink  to="/user/projects/appliedprojects" className={({ isActive }) => (isActive ? "border-b-2 border-b-purple-600 py-3 px-2" : "text-slate-400 py-3 px-2")}>Applied Projects</NavLink>
                    </div>
                </div>
                <div className="h-[80%] w-full">
                    <Outlet/>
                </div>
            </div>
            <div className="h-[50px] w-[50-px] fixed bottom-[30px] right-[30px]  hover:cursor-pointer shadow-lg shadow-slate-300 z-30 rounded-full" onClick={()=>setshowProjectForm(true)}>
                <img src={addIcon} alt="icon" className='w-full h-full'/>
            </div>
        </div>
    )
}
export default Projects;