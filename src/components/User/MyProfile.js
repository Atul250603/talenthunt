import userAvatar from '../../images/userAvatar.png'
import editIcon from '../../images/editIcon.svg'
function MyProfile({seteditProfile,data}){
    return(
        <div className="px-3 py-3 heading">
            <div className="text-xl text-purple-600 font-bold py-2 border-b-2 border-b-purple-600">
                My Profile
            </div>
            <div className="mt-3 font-semibold">
                <div className="bg-slate-100 px-4 py-2 rounded-xl">
                    <div className="my-2 flex justify-between items-center">
                        <div className="text-purple-600">Basic Information</div>
                        <div className="hover:cursor-pointer">
                            <img src={editIcon} alt="edit-icon" onClick={()=>{seteditProfile(true)}}/>
                        </div>
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
                            <div className="hover:cursor-pointer">
                                <img src={editIcon} alt="edit-icon" onClick={()=>{seteditProfile(true)}}/>
                            </div>
                        </div>
                        <div className='font-medium'>
                            {(data.education.length)?data.education.map((element,idx)=><div className={`pb-3 ${(data.education.length>1 && idx!=(data.education.length-1))?' borderbtm':""}`} key={idx}>
                                    <div>
                                        <div className="mt-3">{element.instname}</div>
                                        <div className="flex gap-3">
                                            <div>{element.coursename}</div>
                                            <div>{element.startyear + ' - ' +element.endyear}</div>
                                        </div>
                                        <div>Grade - {element.grade}</div>
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
                            <div className="hover:cursor-pointer">
                                <img src={editIcon} alt="edit-icon" onClick={()=>{seteditProfile(true)}}/>
                            </div>
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
                            <div className="hover:cursor-pointer">
                                <img src={editIcon} alt="edit-icon" onClick={()=>{seteditProfile(true)}}/>
                            </div>
                        </div>
                        <div className='mt-3 flex gap-2 font-medium'>
                            {(data.skills.length)?data.skills.map((element,idx)=><div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white' key={idx}>{element}</div>):<></>}
                        </div>   
                    </div>
                </div>

            </div>
        </div>
    )
}
export default MyProfile;