import { useEffect, useState } from 'react';
import crossIcon from '../../images/closeIcon.svg'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
function JobForm({myProject,setmyProject,setshowJobForm}){
    const [jobTitle, setjobTitle] = useState('');
    const [organizer,setOrganizer]=useState('');
    const [description,setDescription]=useState('');
    const [location,setLocation]=useState('');
    const [salary,setSalary]=useState('');
    const [appdeadline,setappdeadline]=useState('');
    const [showSpinner,setshowSpinner]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        async function init(){
            try{
            let storage=localStorage.getItem('storage');
                storage=JSON.parse(storage);
                if(storage && storage.auth && storage.user && storage.user.profileCompleted){
                        if(storage.user_info){
                            let name=storage.user_info.currorg;
                            setOrganizer(name);
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
                                let name=msg.user_info.currorg;
                                setOrganizer(name);
                                localStorage.setItem("storage",JSON.stringify(storage));
                                return;
                            }
                        }
                }
                else if(storage && storage.auth && storage.user && !storage.user.profileCompleted){
                    toast('Complete Your Profile So That We Can Serve You With Better Results',{
                        toastId:'uniquetoastid2'
                    });
                    navigate('/recruiter/profile');
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
        setjobTitle('');
        setDescription('');
        setOrganizer('');
        setSalary('');
        setLocation('');
        setappdeadline('');
        setshowJobForm(false);
    }
    async function addNewJob(){
        try{
        setshowSpinner(true);
        let jobTitlelen=(jobTitle.trim()).length;
        let organizerlen=(organizer.trim()).length;
        let desclen=(description.trim()).length;
        let sallen=(salary.trim()).length;
        let loclen=(location.trim()).length;
        let appdeadlinelen=(String(appdeadline).trim()).length;
        let appdeadlineval=new Date(appdeadline);
        if(jobTitlelen<=0){
            throw 'Hackathon Title Is Required';
        }
        else if(organizerlen<=0){
            throw 'Organizer Name Is Required';
        }
        else if(desclen<=0){
            throw 'Job Description Is Required';
        }
        else if(sallen<=0){
            throw 'Salary Is Required';
        }
        else if(salary.match(/^[0-9]+$/) === null){
            throw 'Salary Must Be A Number';
        }
        else if(Number(salary)<=0){
            throw 'Salary Must Be Greater Than 0';
        }
        else if(loclen<=0){
            throw 'Location Is Required';
        }
        else if(appdeadlinelen<=0){
            throw 'Application Deadline Is Required';
        }
        else if(appdeadlineval.toLocaleDateString()<new Date().toLocaleDateString()){
            throw "Application Deadline Can't Be In Past ";
        }
        else{
            let data={
                jobTitle:jobTitle,
                organizer:organizer,
                description:description,
                salary:salary,
                location:location,
                appdeadline:appdeadline
            }
            let storage=localStorage.getItem('storage');
            storage=JSON.parse(storage);
            let resp=await fetch("http://localhost:5000/job/createjob",{
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
                cpymyprojects.push(msg.job);
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
            setshowSpinner(false);
        }
    }
    return(
        <div className="w-screen h-screen fixed top-0 left-0 flex items-center overflow-hidden justify-center bg-black bg-opacity-75 z-30 heading py-2">
            <div className="w-1/2 bg-white rounded-xl px-3 py-3 overflow-y-scroll hideScroll">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-xl text-purple-600 heading font-semibold text-center'>Hire For New Job</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-3 h-full flex flex-col justify-center text-sm'>
                    <div className='w-full flex flex-col items-center justify-center'>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Job Title</div>
                            <div className="py-1 w-full"><input type="text" name="hackTitle" id="hackTitle" className="outline-none w-full bg-white" autoComplete="off" value={jobTitle} onChange={(e)=>{setjobTitle(e.target.value)}}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Organizer Name</div>
                            <div className="py-1 w-full"><input type="text" name="organizername" id="organizername" className="outline-none w-full bg-white" autoComplete="off" value={organizer} disabled={true}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Description</div>
                            <div className="py-1 w-full">
                                <textarea name='desc' id='desc' value={description} onChange={(e)=>setDescription(e.target.value)} className='resize-none outline-none w-full bg-white'></textarea>   
                            </div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Salary</div>
                            <div className="py-1 w-full">
                                <input name='salary' id='salary' value={salary} onChange={(e)=>setSalary(e.target.value)} className='resize-none outline-none w-full bg-white'/> 
                            </div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Job Location</div>
                            <div className="py-1 w-full">
                                <input name='jobloc' id='jobloc' value={location} onChange={(e)=>setLocation(e.target.value)} className='resize-none outline-none w-full bg-white'/> 
                            </div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                                <div className="text-purple-600 font-medium">Application Deadline</div>
                                <div className="py-1 w-full">
                                    <DatePicker
                                        selected={appdeadline}
                                        onChange={(date) => setappdeadline(date)} 
                                    />   
                                </div>
                            </div>
                    <div className='w-full mt-4 flex justify-center'>
                    <button className="bg-purple-600 text-white w-1/2 px-2 py-2 rounded-xl font-semibold" onClick={()=>{addNewJob()}}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>:<></>}Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default JobForm;