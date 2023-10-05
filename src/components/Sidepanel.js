import projectIcon from '../images/projectIcon.svg'
import jobIcon from '../images/jobIcon.svg'
import eventIcon from '../images/eventIcon.svg'
import userIcon from '../images/userIcon.svg'
import logoutIcon from '../images/logoutIcon.svg'
function Sidepanel(){
    return(
        <div className="h-screen w-[10%] px-2 py-2 fixed">
            <div className="bg-purple-600 rounded-xl w-full text-white h-full shadow-2xl px-2 py-2">
                <div className="brandname text-4xl flex items-center justify-center px-2 py-2">
                    <div className='bg-white text-purple-600 rounded-full px-2 py-2'>tX</div>
                </div>
                <div className="flex flex-col items-center justify-center py-3 heading">
                    <div className="w-3/4 justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2"><div><img src={projectIcon} alt="sidepanel-icon"/></div><div>Projects</div></div>
                    <div className="w-3/4 justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2"><div><img src={eventIcon} alt="sidepanel-icon"/></div><div>Hackathons</div></div>
                    <div className="w-3/4 justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2"><div><img src={jobIcon} alt="sidepanel-icon"/></div><div>Jobs</div></div>
                    <div className="w-3/4 justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2"><div><img src={userIcon} alt="sidepanel-icon"/></div><div>My Profile</div></div>
                    <div className="w-3/4 justify-center flex flex-col items-center sidepanel-items text-sm font-semibold gap-2 my-2 py-2"><div><img src={logoutIcon}  alt="sidepanel-icon"/></div><div>Logout</div></div>
                </div>
            </div>
        </div>
    )
}
export default Sidepanel;