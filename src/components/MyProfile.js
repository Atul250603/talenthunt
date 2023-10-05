import userAvatar from '../images/userAvatar.png'
import editIcon from '../images/editIcon.svg'
function MyProfile({seteditProfile}){
    return(
        <div className="px-3 py-3 heading">
            <div className="text-2xl text-purple-600 font-bold py-2 border-b-2 border-b-purple-600">
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
                    <div className="flex items-center gap-3 my-3">
                        <div className="user-image">
                            <img src={userAvatar} alt="user-profile-image" className="w-full h-full"/>
                        </div>
                        <div>
                            <div>User Name</div>
                            <div className="flex gap-3">
                                <div>Email Address</div>
                                <div>Phone Number</div>
                            </div>
                            <div>
                                Links
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
                        <div>
                            <div className='pb-3'>
                                <div>
                                    <div className="mt-3">Institute Name</div>
                                    <div className="flex gap-3">
                                        <div>Course Name</div>
                                        <div>Year</div>
                                        <div>Grade</div>
                                    </div>
                                </div>
                            </div>
                            <div className='pb-3'>
                                <div className="mt-3">
                                    <div>Institute Name</div>
                                    <div className="flex gap-3">
                                        <div>Course Name</div>
                                        <div>Year</div>
                                        <div>Grade</div>
                                    </div>
                                </div>
                            </div>
                            <div className='pb-3'>
                                <div className="mt-3">
                                    <div>Institute Name</div>
                                    <div className="flex gap-3">
                                        <div>Course Name</div>
                                        <div>Year</div>
                                        <div>Grade</div>
                                    </div>
                                </div>
                            </div>
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
                        <div>
                            <div className='pb-3'>
                                <div>
                                    <div className="mt-3">Company Name</div>
                                    <div className="flex gap-3">
                                        <div>Role Name</div>
                                        <div>Year</div>
                                    </div>
                                    <div>
                                        Job Description
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='pb-3'>
                                    <div className="mt-3">Company Name</div>
                                    <div className="flex gap-3">
                                        <div>Role Name</div>
                                        <div>Year</div>
                                    </div>
                                    <div>
                                        Job Description
                                    </div>
                                </div>
                            </div>
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
                        <div className='mt-3 flex gap-2'>
                            <div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white'>C++</div>
                            <div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white'>C</div>
                            <div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white'>ReactJS</div>
                            <div className='rounded-full bg-slate-600 min-w-[4%] w-auto text-center px-2 py-1 text-white'>NodeJS</div>
                        </div>   
                    </div>
                </div>

            </div>
        </div>
    )
}
export default MyProfile;