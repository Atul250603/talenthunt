import error404 from '../images/error404.png'
function Error404(){
    return(
        <div className="w-screen h-screen overflow-y-hidden flex items-center justify-center px-2 py-2 bg-purple-200">
            <div className='w-1/2 text-center'>
                <div className='w-full text-6xl logo text-purple-800 font-extrabold'>Error 404!</div>
                <div className='w-full text-5xl brandname text-purple-600'>Looks like you've taken a wrong turn in the digital wilderness.</div>
            </div>
            <div className='h-screen w-1/2'>
                <img src={error404} alt="bg-icon" className='h-full w-full'/>
            </div>
        </div>
    )
}
export default Error404;