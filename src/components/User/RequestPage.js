import { useEffect, useState } from 'react';
import userAvatar from '../../images/userAvatar.png'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
function RequestPage(){
    const [data,setData]=useState();
    const {id,uid}=useParams();
    const {state}=useLocation();
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
                if(!state || !state.userinfo){
                    const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/project/getprofile/${uid}/p/${id}`,{
                        method:"POST",
                        mode:"cors",
                        headers:{
                            "Content-Type": "application/json",
                            "authToken":storage.auth
                        }
                    });
                    const msg=await resp.json();
                    if(msg && msg.success){
                        setData(msg.user_info);
                    }
                    else if(msg && msg.error){
                        throw msg.error;
                    }
                    else{
                       throw "Some Error Occured";
                    }
                }
                else{
                    setData(state.userinfo);
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
            navigate('/user/projects/myprojects');
        }
        }
        init();
    },[])
    async function rejectRequest(){
        try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/project/rejectuser/${id}/u/${uid}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                })
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    navigate(`/user/projects/myprojects/${id}`,{state:{...state}});
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
            navigate('/user/projects/myprojects');
        }
    }
    async function acceptRequest(){
        try{
            let storage=localStorage.getItem('storage');
            if(!storage){
                navigate('/');
            }
            storage=await JSON.parse(storage);
            if(storage && storage.auth){
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/project/acceptuser/${id}/u/${uid}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/json",
                        "authToken":storage.auth
                    }
                })
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    navigate(`/user/projects/myprojects/${id}`,{state:{...state}});
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
            navigate('/user/projects/myprojects');
        }
    }
    return(
        <div className="px-3 py-3 heading">
           {(data)?
            <div className="mt-3 font-semibold">
                <div className="bg-slate-100 px-4 py-2 rounded-xl">
                    <div className="my-2 flex justify-between items-center">
                        <div className="text-purple-600">Basic Information</div>
                    </div>
                    <div className="flex items-center gap-3 my-3 font-medium">
                        <div className="user-image">
                            <img src={(data.profileImg)?data.profileImg:userAvatar} alt="user-profile-image" className="w-full h-full border-2 border-purple-600 rounded-full"/>
                        </div>
                        <div>
                            <div className='capitalize'>{data.fname +" "+data.lname}</div>
                            <div>
                                <div>{data.email}</div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {
                                    (data.socials.length>0)?data.socials.map((element,idx)=><a href={element.link} className='capitalize text-purple-600 underline underline-offset-1' key={idx}>{element.linktitle}</a>):<></>
                                }
                            </div>
                            <div className='mt-2'>
                                {
                                    (data.resume)?<a href={data.resume} className='bg-purple-600 px-2 py-1 text-white rounded-full' target='_blank'>Resume</a>:<></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 font-semibold">
                    <div className="bg-slate-100 px-4 py-2 rounded-xl">
                        <div className="my-2 flex justify-between items-center">
                            <div className="text-purple-600">Education Qualification</div>
                        </div>
                        <div className='font-medium'>
                            {(data.education.length)?data.education.map((element,idx)=><div className={`pb-3 ${(data.education.length>1 && idx!=(data.education.length-1))?' borderbtm':""}`} key={idx}>
                                    <div>
                                        <div className="mt-3">{element.instname}</div>
                                        <div className="flex gap-3">
                                            <div>{element.coursename}</div>
                                            <div>{element.startyear + ' - ' +element.endyear}</div>
                                        </div>
                                        <div>{element.grade}</div>
                                    </div>
                                </div>):<></>
                            }
                        </div>
                    </div>
                </div>

                <div className="mt-3 font-semibold">
                    <div className="bg-slate-100 px-4 py-2 rounded-xl">
                        <div className="my-2 flex justify-between items-center">
                            <div className="text-purple-600">Work Experience</div>
                        </div>
                        <div className='font-medium'>
                            {
                                (data.workexp.length)?data.workexp.map((element,idx)=><div className={`pb-3 ${(data.workexp.length>1 && idx!=(data.workexp.length-1))?' borderbtm':""}`} key={idx}>
                                <div>
                                    <div className="mt-3">{element.companyname}</div>
                                    <div className="flex gap-3">
                                        <div>{element.rolename}</div>
                                        <div>{element.startyear + ' - ' +element.endyear}</div>
                                    </div>
                                    <div>
                                        {element.jobdesc}
                                    </div>
                                </div>
                            </div>):<></>
                            }
                        </div>
                    </div>
                </div>

                <div className="mt-3 font-semibold">
                    <div className="bg-slate-100 px-4 py-2 rounded-xl">
                        <div className="my-2 flex justify-between items-center">
                            <div className="text-purple-600">Skills</div>
                        </div>
                        <div className='mt-3 flex gap-2 font-medium'>
                            {(data.skills.length)?data.skills.map((element,idx)=><div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white' key={idx}>{element}</div>):<></>}
                        </div>   
                    </div> 
                </div>
                <div className='mt-4 font-semibold w-full flex justify-center items-center gap-4'>
                    <div className='w-1/4 text-center bg-red-600 text-white px-2 py-2 rounded-full hover:cursor-pointer' onClick={()=>{rejectRequest()}}>Reject</div>   
                    <div className='w-1/4 text-center bg-green-600 text-white px-2 py-2 rounded-full hover:cursor-pointer' onClick={()=>{acceptRequest()}}>Accept</div>   
                </div>
            </div>:<div>Loading...</div>}
        </div>
    )
}
export default RequestPage;