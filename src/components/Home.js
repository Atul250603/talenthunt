import coder_vector from '../images/coder_vector.png';
import project1 from '../images/project1.png';
import project2 from '../images/project2.png';
import event from '../images/event.png';
import code from '../images/code.png';
import Login from './Login';
import { useEffect, useState } from 'react';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function Home({loginDisplay,signupDisplay,setloginDisplay,setsignupDisplay}){
    const navigate=useNavigate();
    useEffect(()=>{
        function init(){
            try{
            let storage=localStorage.getItem('storage');
            if(storage){
                storage=JSON.parse(storage);
                if(storage.auth){
                    if(storage.user.type==='Candidate'){
                        navigate('/user/projects/');
                    }
                    else if(storage.user.type==='Organizer'){
                        navigate('/org/hackathons'); 
                    }
                    else if(storage.user.type==='Recruiter'){
                        navigate('/recruiter/jobs')
                    }
                }
                else{
                    navigate('/');
                }
            }
            else{
                navigate('/');
            }
            }
            catch(error){
                toast.error(error);
            }
        }
        init();
    },[])
    return(
        <div className="bg-gradient-to-r from-transparent to-purple-100">
            <div className='flex justify-center items-center w-full px-3 '>
                <div className='w-3/4 text-5xl mainHeading text-center'><div className='text-purple-600 '>Find. Collaborate. Succeed.</div><div className='text-4xl'>One Stop Platform To Find Talented Individuals</div></div>
                <div className='w-1/4'>
                    <img src={coder_vector} alt="Coder Image" className='w-full mx-auto block'/>
                </div>
            </div>
            <div className='py-4 px-3 w-full'>
                <div className='text-center text-purple-600 subheading text-2xl'>Why TalentX?</div>
                <div className='grid grid-cols-2 gap-4 text-center my-6 cards w-3/4 mx-auto'>
                    <div className='card border-b-2 border-orange-600 shadow bg-white'>
                        <div className="flex items-center justify-center py-2">
                            <div className='w-1/2'>
                                <img src={project1} alt="icons" className='mx-auto block'/>
                            </div>
                        </div>
                        <div className='card-text'>
                            <div className='text-lg text-orange-600'>Host Projects</div>
                            <div>You can host the projects that you are working on and can find the ideal teammates.</div>
                        </div>
                    </div>
                    <div className='card border-b-2 border-green-600 shadow bg-white'>
                        <div className="flex items-center justify-center py-2">
                            <div className='w-1/2'>
                                <img src={project2} alt="icons" className='mx-auto block'/>
                            </div>
                        </div>
                        <div className='card-text'>
                            <div className='text-lg text-green-600'>Find Projects</div>
                            <div>You can find many projects and show your interest in working on the project by swiping right.</div>
                        </div>
                    </div>
                    <div className='card border-b-2 border-teal-600 shadow bg-white'>
                        <div className="flex items-center justify-center py-2">
                            <div className='w-1/2'>
                                <img src={code} alt="icons" className='mx-auto block'/>
                            </div>
                        </div>
                        <div className='card-text'>
                            <div className='text-lg text-teal-600'>Participate In Hackathons</div>
                            <div>You can take participate in as many hackathons as you like and grab great and exciting prizes.</div>
                        </div>
                    </div>
                    <div className='card border-b-2 border-cyan-600 shadow bg-white'>
                        <div className="flex items-center justify-center py-2">
                            <div className='w-1/2'>
                                <img src={event} alt="icons" className='mx-auto block'/>
                            </div>
                        </div>
                        <div className='card-text'>
                            <div className='text-lg text-cyan-600'>Host Events</div>
                            <div>You can host hackathons, hiring events that are conducted in several rounds and later on recieve full analytical report of the event.</div>
                        </div>
                    </div>
                </div>
            </div>
            {<Login loginDisplay={loginDisplay} setloginDisplay={setloginDisplay}/>}
            {<Signup signupDisplay={signupDisplay} setsignupDisplay={setsignupDisplay} setloginDisplay={setloginDisplay}/>}
        </div>
    )
}
export default Home;