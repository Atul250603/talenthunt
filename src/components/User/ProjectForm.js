import { useEffect, useState } from 'react';
import crossIcon from '../../images/closeIcon.svg'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function ProjectForm({myProject,setmyProject,setshowProjectForm}){
    const [projectTitle, setprojectTitle] = useState('');
    const [creator,setCreator]=useState('');
    const [description,setDescription]=useState('');
    const [skills,setSkills]=useState([]);
    const [skill,setSkill]=useState('');
    const [sameOrg,setsameOrg]=useState(false);
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        async function init(){
            try{
            let storage=localStorage.getItem('storage');
                storage=await JSON.parse(storage);
                if(storage && storage.auth && storage.user && storage.user.profileCompleted){
                        if(storage.user_info){
                            let name=storage.user_info.fname[0].toUpperCase()+storage.user_info.fname.substring(1)+" "+storage.user_info.lname[0].toUpperCase()+storage.user_info.lname.substring(1);
                            setCreator(name);
                        }
                        else{
                            let resp=await fetch('http://localhost:5000/user/getprofile',{
                                method:"POST",
                                mode:"cors",
                                headers:{
                                    "Content-Type":"application/json",
                                    "authToken":storage.auth
                                }
                            })
                            let msg=await resp.json();
                            if(!msg)throw "Some Error Occured";
                            if(msg && msg.error){
                                throw msg.error;
                            }
                            if(msg && msg.success){
                                storage={...storage,user_info:msg.user_info};
                                let name=msg.user_info.fname[0].toUpperCase()+msg.user_info.fname.substring(1)+" "+msg.user_info.lname[0].toUpperCase()+msg.user_info.lname.substring(1);
                                setCreator(name);
                                localStorage.setItem("storage",JSON.stringify(storage));
                                return;
                            }
                        }
                }
                else if(storage && storage.auth && storage.user && !storage.user.profileCompleted){
                    toast('Complete Your Profile So That We Can Serve You With Better Results',{
                        toastId:'uniquetoastid2'
                    });
                    navigate('/user/profile');
                }
                else if(!storage || !storage.user || !storage.auth){
                    navigate('/');
                }
            }
            catch(error){
                console.log(error);
            }
        }
        init();
    },[])
    function closePopUp(){
        setprojectTitle('');
        setCreator('');
        setDescription('');
        setSkills([]);
        setSkill('');
        setshowProjectForm(false);
    }
    async function addNewProject(){
        try{
        let projecttitlelen=(projectTitle.trim()).length;
        let creatorlen=(creator.trim()).length;
        let desclen=(description.trim()).length;
        let skillslen=skills.length;
        setshowSpinner(true);
        if(projecttitlelen<=0){
            toast.error('Project Title Is Required');
            return;
        }
        else if(creatorlen<=0){
            toast.error('Creator Name Is Required');
            return;
        }
        else if(desclen<=0){
            toast.error('Project Description Is Required');
            return;
        }
        else if(skillslen<=0){
            toast.error('Skills Are Required');
            return;
        }
        else{
            let data={
                projectTitle:projectTitle,
                description:description,
                skills:skills,
                sameOrg:sameOrg,
                creator:creator
            }
            let storage=localStorage.getItem('storage');
            storage=await JSON.parse(storage);
            let resp=await fetch("http://localhost:5000/project/postproject",{
                method:"POST",
                mode: "cors",
                headers:{
                    "Content-Type": "application/json",
                    "authToken":storage.auth
                },
                body:JSON.stringify(data)
            });
            let msg=await resp.json();
            if(msg && msg.success){
                let cpymyprojects=[...myProject];
                cpymyprojects.push(msg.project);
                setmyProject(cpymyprojects);
                toast.success(msg.success);
                setshowSpinner(false);
                closePopUp();
            }
            else if(msg && msg.error){
                throw msg.error;
            }
            else{
                throw "Some Error Occured";
            }

        }
        }
        catch(error){
            toast.error(error);
        }
    }
    function enterSkill(e){
        try{
        if(e.key==="Enter"){
            if((skills.length>0) && ((skill.trim()).length)>0 && skills.includes(skill)){
                setSkill('');
            }
            else if(((skill.trim()).length)>0 && !skills.includes(skill)){
                let cpyskills=[...skills];
                cpyskills.push(skill.trim());
                setSkills(cpyskills);
                setSkill('');
            }
        }
        }
        catch(error){
            toast.error("Error In Creating Skill");
        }
    }
    function removeSkills(element){
        try{
        if(skills.length<=0)return;
        let cpyskills=[...skills];
        let idx=cpyskills.findIndex((value)=>value===element);
        cpyskills.splice(idx,1);
        setSkills(cpyskills);
        }
        catch(error){
            toast.error("Error In Deleting Skill")
        }
    }
    return(
        <div className="w-screen h-screen fixed flex items-center overflow-hidden justify-center bg-black bg-opacity-75 z-30 heading py-2">
            <div className="w-1/2 h-[98%] bg-white rounded-xl px-3 py-3 overflow-y-scroll hideScroll">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-xl text-purple-600 heading font-semibold text-center'>Create New Project</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-3 flex flex-col justify-center text-sm'>
                    <div className='w-full flex flex-col items-center justify-center'>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Project Title</div>
                            <div className="py-1 w-full"><input type="text" name="projTitle" id="projTitle" className="outline-none w-full bg-white" autoComplete="off" value={projectTitle} onChange={(e)=>{setprojectTitle(e.target.value)}}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Creator Name</div>
                            <div className="py-1 w-full"><input type="text" name="creatorname" id="creatorname" className="outline-none w-full bg-white" autoComplete="off" value={creator} disabled={true}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Description</div>
                            <div className="py-1 w-full">
                                <textarea name='desc' id='desc' value={description} onChange={(e)=>setDescription(e.target.value)} className='resize-none outline-none w-full bg-white'></textarea>   
                            </div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Skills Required</div>
                            <div className="py-1 w-full">
                                <div className='bg-slate-100 rounded-xl px-2 py-2 flex items-center gap-2 flex-wrap'>
                                    {(skills.length>0)?skills.map((element,idx)=><div className='flex px-2 py-1 rounded-full bg-slate-600 text-white min-w-[4%] w-max gap-2' key={idx}>
                                    <div>{element}</div>
                                    <div className='hover:cursor-pointer' onClick={()=>{removeSkills(element)}}>x</div>
                                    </div>):<>No Skills Added</>}
                                </div>
                                <div className='w-full py-1'>
                                    <input type="text" name="skills" id="uskills" placeholder='Type Skills Here And Hit Enter' className="outline-none w-full my-1 px-1 py-1" autoComplete="off" value={skill} onChange={(e)=>{setSkill(e.target.value)}} onKeyDown={(e)=>{enterSkill(e)}}/>
                                </div>
                            </div>
                        </div>
                        <div className='py-1 w-3/4 my-2 flex items-center justify-between'>
                            <div className="text-sm font-medium text-purple-600 dark:text-gray-300">Same Organization Only</div>
                            <div className='flex items-center'>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value={sameOrg} class="sr-only peer" onClick={(e)=>setsameOrg((prev)=>!prev)}/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-4 flex justify-center'>
                        <button className="bg-purple-600 text-white w-1/2 px-2 py-2 rounded-xl font-semibold" onClick={()=>{addNewProject()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProjectForm;