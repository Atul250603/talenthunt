function Navbar(){
    return(
        <div className="flex justify-between px-3 py-3 shadow-md items-center navbar sticky top-0 z-50 bg-white">
            <div className="text-purple-600 font-extrabold text-3xl brandname">
                talenthunt
            </div>
            <div className="flex gap-2 buttons">
                <div className="rounded bg-purple-600 text-center px-3 py-1 text-white font-semibold hover:cursor-pointer flex items-center">Login</div>
                <div className="rounded text-purple-600 text-center px-3 py-1 font-semibold border-2 border-purple-600 hover:cursor-pointer flex items-center">Signup</div>
            </div>
        </div>
    )
}
export default Navbar;