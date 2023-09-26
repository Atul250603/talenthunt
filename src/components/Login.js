import cross from '../images/cross.svg'
import viewIcon from '../images/view.svg'
import hideIcon from '../images/hide.svg'
import { useState } from 'react'
function Login({loginDisplay,setloginDisplay}){
    const [view, setview] = useState(false);
    return(
        <div className={`fixed top-0 right-0 h-screen px-2 shadow-2xl flex items-center w-1/4 bg-white z-50 slide ${(loginDisplay)?"slideIn":"slideOut"}`}>
            <div className="w-full form">
            <div className="px-3 flex items-center justify-between py-4 mb-4">
                <div className='text-purple-600 text-3xl font-semibold'>Login</div>
                <div className='hover:cursor-pointer'><img src={cross} alt="cross" onClick={()=>{setloginDisplay(false)}}/></div>
            </div>
            <div className="w-full px-3 ">
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full">
                    <div className="text-purple-600">Email</div>
                    <div className="py-1 w-full"><input type="mail" name="mail" id="mail" className="outline-none w-full" autocomplete="off"/></div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full mt-5" >
                    <div className="text-purple-600">Password</div>
                    <div className="py-1 w-full flex items-center"><input type={`${(!view)?"password":"text"}`} name="password" id="password" className="outline-none w-full" autocomplete="off"/>{(!view)?<img src={viewIcon} alt="view" onClick={()=>{setview(true)}} className='hover:cursor-pointer'/>:<img src={hideIcon} alt="hide" onClick={()=>{setview(false)}} className='hover:cursor-pointer'/>}</div>
                </div>
                <div className="text-center mt-6">
                <button className="text-white rounded bg-purple-600 px-3 py-3 w-full">Login</button>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Login;