import { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import PopupEducationForm from "./PopupEducationForm";
import PopupWorkForm from "./PopupWorkForm";
import PopupLinkForm from "./PopupLinkForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Profile(){
    const [editProfile, seteditProfile] = useState(false);
    const [identifier,setidentifier]=useState(0);
    const [data,setData]=useState({
        fname:'',
        lname:'',
        email:'',
        currorg:'',
        education:[],
        workexp:[],
        skills:[],
        socials:[],
        profileimg:'',
        resume:''
    });
    const [education, seteducation] = useState([])
    const [work, setwork] = useState([])
    const [socials, setsocials] = useState([])
    const navigate=useNavigate();
    useEffect(()=>{
       async function initializeStates(){
            try{
                let storage=localStorage.getItem('storage');
                storage=await JSON.parse(storage);
                if(storage && storage.auth && storage.user && storage.user.profileCompleted){
                    if(storage.user && storage.user.type==='Organizer'){
                        navigate('/org/hackathons')
                    }
                        else{
                            if(storage.user && !storage.user.profileCompleted){
                                navigate('/user/profile');
                            }
                            else{
                        if(storage.user_info){
                            setData(storage.user_info);
                            seteducation(storage.user_info.education);
                            setwork(storage.user_info.workexp);
                            setsocials(storage.user_info.socials);
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
                                setData(storage.user_info);
                                seteducation(storage.user_info.education);
                                setwork(storage.user_info.workexp);
                                setsocials(storage.user_info.socials);
                                localStorage.setItem("storage",JSON.stringify(storage));
                                return;
                            }
                        }
                    }
                }
                }
                else if(storage && storage.auth && storage.user && !storage.user.profileCompleted){
                    toast('Complete Your Profile So That We Can Serve You With Better Results',{
                        toastId:'uniquetoastid1'
                    });
                    seteditProfile(true);
                }
                else if(!storage || !storage.user || !storage.auth){
                    navigate('/');
                }
            }
            catch(error){
                console.log(error);
            }
        }
        initializeStates();
    },[])
    return(
        <div className="w-full min-h-screen max-h-auto bg-slate-100 flex">
            {(identifier===1)?<PopupEducationForm setidentifier={setidentifier}  title="Education Qualification" education={education} seteducation={seteducation}/>:(identifier===2)?<PopupWorkForm setidentifier={setidentifier}  title="Work Experience" work={work} setwork={setwork}/>:(identifier===3)?<PopupLinkForm setidentifier={setidentifier}  title="Social Link" socials={socials} setsocials={setsocials}/>:
            <></>}
            <div className="w-[89%] bg-white rounded-xl my-2 relative left-[10%]">
                {
                    (!editProfile)?<MyProfile seteditProfile={seteditProfile} data={data}/>:<EditProfile seteditProfile={seteditProfile} setidentifier={setidentifier} data={data} setData={setData} education={education} work={work} socials={socials}/>
                }
            </div>
        </div>
    )
}
export default Profile;