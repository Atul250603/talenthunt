import projectIcon from '../../images/projectIcon.svg'
import jobIcon from '../../images/jobIcon.svg'
import eventIcon from '../../images/eventIcon.svg'
import userIcon from '../../images/userIcon.svg'
import logoutIcon from '../../images/logoutIcon.svg'
import projectIconFilled from '../../images/projectIconFilled.svg'
import jobIconFilled from '../../images/jobIconFilled.svg'
import eventIconFilled from '../../images/eventIconFilled.svg'
import userIconFilled from '../../images/userIconFilled.svg'
import logoutIconFilled from '../../images/logoutIconFilled.svg'
import {useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
function Sidepanel(){
    const navigate=useNavigate();
    const [selectedBtn,setselectedBtn]=useState();
    const path=useLocation().pathname.split('/');
    useEffect(()=>{
        function init(){
            try{
                if(path.indexOf('projects')>=0){
                    setselectedBtn(0);
                }
                else if(path.indexOf('hackathons')>=0){
                    setselectedBtn(1);
                }
                else if(path.indexOf('jobs')>=0){
                    setselectedBtn(2);
                }
                else if(path.indexOf('profile')>=0){
                    setselectedBtn(3);
                }
            }
            catch(error){
                navigate('/');
            }
        }
        init();
    },[])
    function logoutHandler(){
        localStorage.removeItem('storage');
        navigate('/');
    }
    return(
        <div className="h-screen w-[10%] px-2 py-2 fixed">
            <div className="bg-purple-600 rounded-xl w-full text-white h-full shadow-2xl px-2 py-2">
                <div className="brandname text-4xl flex items-center justify-center px-2 py-2">
                    <div className='bg-white text-purple-600 rounded-full px-3 py-2 logo shadow-lg'>tX</div>
                </div>
                <div className="flex flex-col items-center justify-center py-3 heading w-full">
                    <div className={`w-full justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2 hover:cursor-pointer ${(selectedBtn===0)?"bg-white text-purple-600 rounded-xl shadow-lg":""}`} onClick={()=>{setselectedBtn(0);navigate('/user/projects/')}}><div><img src={(selectedBtn===0)?projectIconFilled:projectIcon} alt="sidepanel-icon"/></div><div className='w-full text-center'>Projects</div></div>
                    <div className={`w-full justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2 hover:cursor-pointer ${(selectedBtn===1)?"bg-white text-purple-600 rounded-xl shadow-lg":""}`} onClick={()=>{setselectedBtn(1);navigate('/user/hackathons/')}}><div><img src={(selectedBtn===1)?eventIconFilled:eventIcon} alt="sidepanel-icon"/></div><div className='w-full text-center'>Hackathons</div></div>
                    <div className={`w-full justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2 hover:cursor-pointer ${(selectedBtn===2)?"bg-white text-purple-600 rounded-xl shadow-lg":""}`} onClick={()=>{setselectedBtn(2);navigate()}}><div><img src={(selectedBtn===2)?jobIconFilled:jobIcon} alt="sidepanel-icon"/></div><div className='w-full text-center'>Jobs</div></div>
                    <div className={`w-full justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2 hover:cursor-pointer ${(selectedBtn===3)?"bg-white text-purple-600 rounded-xl shadow-lg":""}`} onClick={()=>{setselectedBtn(3);navigate('/user/profile')}}><div><img src={(selectedBtn===3)?userIconFilled:userIcon} alt="sidepanel-icon"/></div><div className='w-full text-center'>My Profile</div></div>
                    <div className="w-full justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2 hover:cursor-pointer" onClick={()=>{logoutHandler()}}><div><img src={logoutIcon}  alt="sidepanel-icon"/></div><div className='w-full text-center'>Logout</div></div>
                </div>
            </div>
        </div>
    )
}
export default Sidepanel;