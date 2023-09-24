import cross from '../images/cross.svg'
function Login(){
    return(
        <div className="fixed top-0 right-0 h-screen px-2 shadow flex items-center w-1/4 bg-white z-50">
            <div className="w-full form">
            <div className="px-3 flex items-center justify-between py-4 mb-4">
                <div className='text-purple-600 text-3xl font-semibold'>Login</div>
                <div className='hover:cursor-pointer'><img src={cross} alt="cross"/></div>
            </div>
            <div className="w-full px-3 ">
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full">
                    <div className="text-purple-600">Email</div>
                    <div className="py-1 w-full"><input type="mail" name="mail" id="mail" className="outline-none w-full" /></div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full mt-5" >
                    <div className="text-purple-600">Password</div>
                    <div className="py-1 w-full"><input type="password" name="password" id="password" className="outline-none w-full"/></div>
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