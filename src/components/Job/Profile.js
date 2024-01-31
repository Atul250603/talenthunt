import { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import PopupLinkForm from "./PopupLinkForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Profile(){
    const [editProfile, seteditProfile] = useState(false);
    const [identifier,setidentifier]=useState(0);
    const [data,setData]=useState({
        orgname:'',
        fname:'',
        lname:'',
        email:'',
        socials:[],
        profileimg:''
    });
    const [socials, setsocials] = useState([])
    const navigate=useNavigate();
    useEffect(()=>{
       async function initializeStates(){
            try{
                let storage=localStorage.getItem('storage');
                storage=JSON.parse(storage);
                if(storage && storage.auth && storage.user && storage.user.profileCompleted){
                        if(storage.user.type==='Candidate'){
                            navigate('/user/projects')
                        }
                        else if(storage.user.type==='Organizer'){
                            navigate('/org/hackathons');
                        }
                        else{
                        if(storage.user_info){
                            setData(storage.user_info);
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
                                setsocials(storage.user_info.socials);
                                localStorage.setItem("storage",JSON.stringify(storage));
                            }
                        }
                    }
                }
                else if(storage && storage.auth && storage.user && !storage.user.profileCompleted){
                    toast('Complete Your Profile So That We Can Serve You With Better Results',{
                        toastId:'uniquetoastid2'
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
        <div className="w-full h-full bg-slate-100 flex justify-center">
            {(identifier===1)?<PopupLinkForm setidentifier={setidentifier}  title="Social Link" socials={socials} setsocials={setsocials}/>:
            <></>}
            <div className="w-[98%] h-max bg-white rounded-xl my-2">
                {
                    (!editProfile)?<MyProfile seteditProfile={seteditProfile} data={data}/>:<EditProfile seteditProfile={seteditProfile} setidentifier={setidentifier} data={data} setData={setData} socials={socials}/>
                }
            </div>
        </div>
    )
}
export default Profile;