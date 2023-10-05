import { useState } from "react";
import MyProfile from "./MyProfile";
import Sidepanel from "./Sidepanel";
import EditProfile from "./EditProfile";
import PopupEducationForm from "./PopupEducationForm";
import PopupWorkForm from "./PopupWorkForm";
import PopupLinkForm from "./PopupLinkForm";
function User(){
    const [editProfile, seteditProfile] = useState(false);
    const [identifier,setidentifier]=useState(0);
    const [data,setData]=useState({
        firstname:'',
        lastname:'',
        email:'',
        emailVerified:true,
        phone:'',
        phoneVerified:false,
        currorg:'',
        education:[],
        workExp:[],
        skills:[],
        socials:[]
    });
    const [education, seteducation] = useState([])
    const [work, setwork] = useState([])
    const [socials, setsocials] = useState([])
    return(
        <div className="w-full min-h-screen max-h-auto bg-slate-100 flex relative">
            {(identifier===1)?<PopupEducationForm setidentifier={setidentifier}  title="Education Qualification" education={education} seteducation={seteducation}/>:(identifier===2)?<PopupWorkForm setidentifier={setidentifier}  title="Work Experience" work={work} setwork={setwork}/>:(identifier===3)?<PopupLinkForm setidentifier={setidentifier}  title="Social Link" socials={socials} setsocials={setsocials}/>:
            <></>}
            <Sidepanel/>
            <div className="w-[89%] bg-white rounded-xl my-2 relative left-[10%]">
                {
                    (!editProfile)?<MyProfile seteditProfile={seteditProfile} data={data}/>:<EditProfile seteditProfile={seteditProfile} setidentifier={setidentifier} data={data} setData={setData} education={education} work={work} socials={socials}/>
                }
            </div>
        </div>
    )
}
export default User;