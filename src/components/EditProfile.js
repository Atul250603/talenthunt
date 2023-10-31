import userAvatar from '../images/userAvatar.png'
import 'react-phone-input-2/lib/style.css'
import { useEffect, useState } from 'react'
import addIcon from '../images/addIcon.svg'
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify'
import {auth,storage} from '../firebase.config';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {uid} from 'uid';
function EditProfile({seteditProfile,setidentifier,data,setData,education,work,socials}){ 
    const [fname,setfname]=useState('');
    const [lname,setlname]=useState('');
    const [email,setemail]=useState('');
    const [emailverified,setemailverified]=useState(true);
    const [currorg,setcurrorg]=useState('');
    const [skills,setskills]=useState([]);
    const [skillval,setskillval]=useState('');
    const [profileimg,setprofileimg]=useState(null);
    const [profileimgURL,setprofileimgURL]=useState(null);
    const [profileimgDownloadLink,setprofileimgDownloadLink]=useState('');
    const [resumeDownloadLink,setresumeDownloadLink]=useState('');
    const [resume,setresume]=useState(null);
    const[emailotpsent,setemailotpsent]=useState(false);
    const [emailshowSpinner,setemailshowSpinner]=useState(false);
    const [emailotp,setemailotp]=useState('');
    const[uploadshowSpinner,setuploadshowspinner]=useState(false);
    const [genOTP,setgenOTP]=useState('');
    useEffect(()=>{
        function initializeStates(){
            try{
                if(data){
                    if(data.fname){
                        setfname(data.fname);
                    }
                    if(data.lname){
                        setlname(data.lname);
                    }
                    if(data.email){
                        setemail(data.email);
                    }
                    if(data.currorg){
                        setcurrorg(data.currorg);
                    }
                    if(data.skills && data.skills.length>0){
                        setskills(data.skills);
                    }
                    if(data.profileImg){
                        setprofileimgURL(data.profileImg);
                        setprofileimgDownloadLink(data.profileImg);
                    }
                    if(data.resume){
                        setresume(data.resume);
                        setresumeDownloadLink(data.resume);
                    }
                    if(!((data.email).trim()).length){
                        let storage=localStorage.getItem('storage');
                        storage=JSON.parse(storage);
                        if(storage && storage.user){
                            setemail(storage.user.email);
                        }
                    }
                }
            }
            catch(error){
                console.log(error);
            }
        }
        initializeStates();
    },[])
    function enterSkill(e){
        try{
        if(e.key==="Enter"){
            if((skills.length>0) && ((skillval.trim()).length)>0 && skills.includes(skillval)){
                setskillval('');
            }
            else if(((skillval.trim()).length)>0 && !skills.includes(skillval)){
                let cpyskills=[...skills];
                cpyskills.push(skillval.trim());
                setskills(cpyskills);
                setskillval('');
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
        setskills(cpyskills);
        }
        catch(error){
            toast.error("Error In Deleting Skill")
        }
    }
    async function sendEmailOTP(){
        try{
        setemailshowSpinner(true);
        let genOTP=Math.floor(1000 + Math.random() * 9000);
        setgenOTP(genOTP);
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if((email.trim()).match(mailformat))
        {
           let resp=await fetch('http://localhost:5000/auth/emailverify',{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,otp:genOTP})
           });
           let msg=await resp.json();
           if(msg && msg.success && msg.success.length){
            toast.success('OTP Sent Successfully');
            setemailotpsent(true);
           }
           else if(msg && msg.error){
            toast.error(msg.error);
           }
           else{
            toast.error("Error In Sending OTP");
           }
        }
        else{
            toast.error('Invalid Email Address');
        }
        setemailshowSpinner(false);
        return;
        }
        catch(error){
            setemailshowSpinner(false);
            toast.error("Error In Sending OTP");
        }
    }
    function verifyEmailOTP(){
        try{
        setemailshowSpinner(true);
        if(String(genOTP)===emailotp){
            setemailverified(true);
            setemailotp('');
            setgenOTP('');
            setemailotpsent(false);
        }
        setemailshowSpinner(false);
        }
        catch(error){
            setemailshowSpinner(false);
            toast.error("Error In Verifying OTP");
        }
    }
    function validData(){
        let fnamelen=(fname.trim()).length;
        let lnamelen=(lname.trim()).length;
        let currorglen=(currorg.trim()).length;
        let eduqualificationlen=education.length;
        let workexplen=work.length;
        let skillslen=skills.length;
        let socialslen=socials.length;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!fnamelen){
            toast.error('First Name Is Required');
            return false;
        }
        if(!lnamelen){
            toast.error('Last Name Is Required');
            return false;
        }
        if(!(email.trim()).match(mailformat)){
            toast.error('Invalid Email Address');
            return false;
        }
        if(!emailverified){
            toast.error('Email Address Must Be Verified');
            return false;
        }
        if(!currorglen){
            toast.error("Current Organization Name Is Required");
            return false;
        }
        if(!eduqualificationlen){
            toast.error("Educational Qualification Is Required");
            return false;
        }
        if(!workexplen){
            toast.error("Work Experience Is Required");
            return false;
        }
        if(!skillslen){
            toast.error("Skills Are Required");
            return false;
        }
        if(!socialslen){
            toast.error("Socail Links Are Required");
            return false;
        }
        if((profileimgDownloadLink.trim()).length>0 && (resumeDownloadLink.trim()).length>0)return true;
        if(profileimg===null){
            toast.error("Profile Image Is Required");
            return false;
        }
        if(resume===null){
            toast.error("Resume Is Required");
            return false;
        }
        let imgext=(profileimg.name.split('.').slice(-1)[0]).toLowerCase();
        let resumext=(resume.name.split('.').slice(-1)[0]).toLowerCase();
        if(imgext!=='png' && imgext!=='jpeg' && imgext!=='jpg'){
            toast.error('Profile Image Must Be Of PNG Or JPEG Type');
            return false;
        }
        if(resumext!=='pdf'){
            toast.error('Resume Must Be A PDF File');
            return false;
        }
        return true;
    }
    async function updateProfile(){
        try{
           if(validData()){
                setuploadshowspinner(true);
                let profileimgDownloadLinkLocal=profileimgDownloadLink;
                let resumeDownloadLinkLocal=resumeDownloadLink;
                let uniqueid=uid(32);
                if(!(profileimgDownloadLinkLocal.trim()).length){
                    let imgext=profileimg.name.split('.').slice(-1)[0];
                    const profileImgRef=ref(storage,`profile_images/${uniqueid+"profileimg."+imgext}`);
                    const profileimgresp=await uploadBytes(profileImgRef,profileimg);
                    if(!profileimgresp){
                        throw "Error In Uploading Profile Image";
                    }
                    profileimgDownloadLinkLocal=await getDownloadURL(profileimgresp.ref);
                    if(!(profileimgDownloadLinkLocal.trim()).length){
                        throw "Error In Generating The Profile Image Link";
                    }
                    setprofileimgDownloadLink(profileimgDownloadLinkLocal);
                }   
                if(!(resumeDownloadLinkLocal.trim()).length){
                    let resumext=resume.name.split('.').slice(-1)[0];
                    const resumeRef=ref(storage,`resume/${uniqueid+"resume."+resumext}`);
                    const resumeresp=await uploadBytes(resumeRef,resume);
                    if(!resumeresp){
                        throw "Error In Uploading Resume";
                    }
                    resumeDownloadLinkLocal=await getDownloadURL(resumeresp.ref);
                    if(!(resumeDownloadLinkLocal.trim()).length){
                        throw "Error In Generating The Profile Image Link";
                    }
                    setresumeDownloadLink(resumeDownloadLinkLocal);
                }
                
                let data={
                    fname,
                    lname,
                    email,
                    currorg,
                    education,
                    workexp:work,
                    skills,
                    socials,
                    profileImg:profileimgDownloadLinkLocal,
                    resume:resumeDownloadLinkLocal
                }
                let localstorage=localStorage.getItem('storage');
                localstorage=JSON.parse(localstorage);
                let resp=await fetch('http://localhost:5000/user/editprofile',{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type":"application/json",
                        "authToken":localstorage.auth
                    },
                    body:JSON.stringify(data)
                })
                let msg=await resp.json();
                if(!msg)throw "Some Error Occured";
                if(msg && msg.error){
                    throw msg.error;            
                }
                if(msg && msg.success){
                    toast.success(msg.success);
                    localstorage={...localstorage,user:msg.user,user_info:msg.user_info};
                    localStorage.setItem('storage',JSON.stringify(localstorage));
                    setuploadshowspinner(false);  
                    setData(data);
                    seteditProfile(false);
                    return ;
                }
           }
        }
        catch(error){
            setuploadshowspinner(false);
            toast.error(error);
        }
    }
    return(
        <div className="px-3 py-3 heading">
           
            <div className="text-xl text-purple-600 font-bold py-2 border-b-2 border-b-purple-600">
                Edit My Profile
            </div>
            <div className="mt-3 font-semibold">
                <div className='flex flex-col items-center justify-center'>
                    <div className='user-image rounded-full'>
                        <input type='file' name="profile_image" id="edit_profile_img" accept="image/png,image/jpeg" multiple={false}  onChange={(e)=>{setprofileimg(e.target.files[0]); setprofileimgURL(URL.createObjectURL(e.target.files[0]))}}/>
                        <label htmlFor='edit_profile_img' className='w-full h-full rounded-full'>
                            <img src={(profileimgURL)?profileimgURL:userAvatar} alt="user-profile-image" className='hover:cursor-pointer w-full h-full rounded-full border-2 border-purple-600'/>
                        </label>
                    </div>
                    <div className='mt-2'>Choose Profile Picture</div>
                </div>
                <div className='flex gap-[2%] items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-[32.333%]">
                        <div className="text-purple-600">First Name</div>
                        <div className="py-1 w-full"><input type="text" name="fname" id="fname" className="outline-none w-full" autoComplete="off" value={fname} onChange={(e)=>{setfname(e.target.value)}}/></div>
                    </div>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-[32.333%]">
                        <div className="text-purple-600">Last Name</div>
                        <div className="py-1 w-full"><input type="text" name="lname" id="lname" className="outline-none w-full" autoComplete="off" value={lname} onChange={(e)=>{setlname(e.target.value)}}/></div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600">Email</div>
                        <div className="py-1 w-full flex items-center gap-2">
                            <div className='w-3/4'>
                                <input type="mail" name="mail" id="usermail" className="outline-none w-full" autoComplete="off" value={email} onChange={(e)=>{setemail(e.target.value); setemailverified(false)}}/>
                                {(emailotpsent)?
                                <div>
                                    <OtpInput
                                        value={emailotp}
                                        onChange={setemailotp}
                                        numInputs={4}
                                        renderInput={(props)=><input {...props} />}
                                        containerStyle="w-full d-flex justify-center mt-5"
                                        inputStyle="border-2 border-purple-600 mx-2 text-2xl"
                                    />
                                </div>:<></>}
                            </div>
                            {(emailverified)?<div className='border-2 border-green-600 w-1/4 text-center rounded-full text-green-600 py-1'>
                                Verified
                            </div>:
                            <div className='w-1/4'>
                                 {(!emailotpsent)?
                                    <button className='bg-purple-600 text-center rounded-lg text-white w-full h-full py-1' onClick={()=>{sendEmailOTP()}}>{(emailshowSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>:<></>}Send OTP</button>
                                                                    :<button className='bg-purple-600 text-center rounded-lg text-white w-full h-full py-1' onClick={()=>{verifyEmailOTP()}}>{(emailshowSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>:<></>}Verify</button>
                                }
                            </div>}
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600">Current Organization</div>
                        <div className="py-1 w-full flex items-center gap-2">
                            <div className='w-3/4'>
                                <input type="text" name="currorg" id="currorg" className="outline-none w-full" autoComplete="off" value={currorg} onChange={(e)=>{setcurrorg(e.target.value);}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600 flex items-center justify-between">
                            <div>Education Qualifications</div>
                            <div className='border-2 border-purple-600 px-1 py-1 rounded-full hover:cursor-pointer'>
                                <img src={addIcon} alt="add-icon" onClick={()=>{setidentifier(1)}}  />
                            </div>
                        </div>
                        <div className="py-1 w-full">
                            <div className='pb-3'>
                                {(education && education.length)?education.map((element,idx)=><div className='bg-slate-100 rounded-xl px-2 py-1 my-1 mb-2' key={idx}>
                                    <div className="mt-2">{element.instname}</div>
                                    <div className="flex gap-3">
                                        <div>{element.coursename}</div>
                                        <div>{element.startyear+" - "+element.endyear}</div>
                                        <div>{element.grade}</div>
                                    </div>
                                </div>):<>No Educational Qualifications Added</>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600 flex items-center justify-between">
                            <div>Work Experience</div>
                            <div className='border-2 border-purple-600 px-1 py-1 rounded-full hover:cursor-pointer'>
                                <img src={addIcon} alt="add-icon" onClick={()=>{setidentifier(2)}} />
                            </div>
                        </div>
                        <div className="py-1 w-full">
                            <div className='pb-3'>
                                {(work && work.length>0)?work.map((element,idx)=><div className='bg-slate-100 rounded-xl px-2 py-1 my-1 mb-2' key={idx}>
                                    <div className="mt-2">{element.companyname}</div>
                                    <div className="flex gap-3">
                                        <div>{element.rolename}</div>
                                        <div>{element.startyear+" - "+element.endyear}</div>
                                    </div>
                                    <div>
                                        {element.jobdesc}
                                    </div>
                                </div>):<>No Work Experience Added</>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600 flex items-center justify-between">
                            <div>Skills</div>
                        </div>
                        <div className="py-1 w-full">
                           <div className='bg-slate-100 rounded-xl px-2 py-2 flex items-center gap-2 flex-wrap'>
                                {(skills.length>0)?skills.map((element,idx)=><div className='flex px-2 py-1 rounded-full bg-slate-600 text-white min-w-[4%] w-max gap-2' key={idx}>
                                    <div>{element}</div>
                                    <div className='hover:cursor-pointer' onClick={()=>{removeSkills(element)}}>x</div>
                                </div>):<>No Skills Added</>}
                           </div>
                           <div className='w-full py-1'>
                                <input type="text" name="skills" id="uskills" placeholder='Type Skills Here And Hit Enter' className="outline-none w-full my-1 px-1 py-1" autoComplete="off" value={skillval} onChange={(e)=>{setskillval(e.target.value)}} onKeyDown={(e)=>{enterSkill(e)}}/>
                           </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 items-center justify-center my-3'>
                    <div className="border-2 border-purple-600 rounded px-3 py-1 w-2/3">
                        <div className="text-purple-600 flex items-center justify-between">
                            <div>Social Links</div>
                            <div className='border-2 border-purple-600 px-1 py-1 rounded-full hover:cursor-pointer'>
                                <img src={addIcon} alt="add-icon" onClick={()=>{setidentifier(3)}}/>
                            </div>
                        </div>
                        <div className="py-1 w-full">
                            <div className='pb-3'>
                                {(socials && socials.length)?socials.map((element,idx)=><div className='mt-2 flex gap-2' key={idx}>
                                    <div>{element.linktitle}</div>
                                    <div>
                                        {element.link}
                                    </div>
                                </div>):<>No Links Added</>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-3 flex gap-2 items-center justify-center'>
                    <div className="w-2/3 flex gap-2 items-center justify-center">
                        <div className="text-purple-600 flex items-center justify-between w-1/2">
                            <input type='file' name="resume_file" id="resume_file" accept=".pdf" multiple={false} onChange={(e)=>{setresume(e.target.files[0])}}/>
                            <label htmlFor='resume_file' className='w-full'>
                                <div className='border-2 border-purple-600 w-full px-2 py-2 rounded-full text-center hover:cursor-pointer'>Upload Resume</div>
                            </label>
                        </div>
                        <div className="py-1 w-1/2">
                            <button className='bg-purple-600 text-white px-2 py-2 rounded-full w-full' onClick={()=>{updateProfile()}}>{(uploadshowSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                    </svg>:<></>}Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditProfile;