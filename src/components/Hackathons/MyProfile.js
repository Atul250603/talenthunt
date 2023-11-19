import userAvatar from '../../images/userAvatar.png';
import editIcon from '../../images/editIcon.svg'
function MyProfile({seteditProfile,data}){
    return(
        <div className="w-full">
            {(data)?<div className="w-full px-4 py-2 font-medium heading rounded-xl">
                <div className='w-full font-semibold text-purple-600 my-3 flex items-center justify-between text-lg'>
                    <div>Basic Information</div>
                    <div className='hover:cursor-pointer'>
                        <img src={editIcon} alt="edit-icon" onClick={()=>{seteditProfile(true)}}/>
                    </div>
                </div>
                <div className='w-full flex items-center gap-3 my-3'>
                    <div className='user-image rounded-full border-2 border-purple-600'><img src={(data.profileImg)?data.profileImg:userAvatar} alt="icons" className='h-full w-full rounded-full'/></div>
                    <div>
                        <div className='capitalize'>{data.fname+" "+data.lname}</div>
                        <div>{data.email}</div>
                    </div>
                </div>
                <div className='w-full my-3'>
                    <div className='text-purple-600 font-semibold'>Current Organization</div>
                    <div>{data.currorg}</div>
                </div>
                <div className='w-full my-3'>
                    <div className='text-purple-600 font-semibold'>Socials</div>
                   {
                     (data.socials && data.socials.length>0)?data.socials.map((element,idx)=><div className='flex gap-2 mb-2' key={idx}><div className='capitalize'>{element.linktitle}</div><div><a href={element.link} className='text-purple-600 underline' target='_blank'>{element.link}</a></div></div>):<>No Links Added....</>
                   }
                </div>
            </div>:<div>Loading...</div>}
        </div>
    )
}
export default MyProfile;