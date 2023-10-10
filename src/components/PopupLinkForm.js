import { useState } from 'react';
import crossIcon from '../images/closeIcon.svg'
import { toast } from 'react-toastify';
function PopupLinkForm({setidentifier,title,socials,setsocials}){
    const [linktitle, setlinktitle] = useState('');
    const [link,setlink]=useState('');
    function closePopUp(){
        setlinktitle(''); setlink('');setidentifier(0);
    }
    function addNewLink(){
        try{
            let linktitlelen=(linktitle.trim()).length;
            let linklen=(link.trim()).length;
            let linkValid=new URL(link);
            if(linktitlelen<=0){
                toast.error('Link Title Is Required');
                return;
            }
            else if(linklen<=0){
                toast.error('Link Is Required');
                return;
            }
            else{
                let data={
                    linktitle:linktitle,
                    link:link
                }
                let cpysocials=[...socials];
                cpysocials.push(data);
                setsocials(cpysocials);
            }
            closePopUp();
        }
        catch(error){
            toast.error("Link Isn't Valid");
            return;
        }
    }
    return(
        <div className="w-screen h-screen fixed flex items-center justify-center bg-black bg-opacity-75 z-30">
            <div className="w-1/2 min-h-[50%] max-h-max bg-white rounded-xl px-3 py-3">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-3xl text-purple-600 heading font-semibold text-center'>{title}</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-4 flex flex-col justify-center heading'>
                    <div className='w-full flex flex-col items-center'>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Link Title</div>
                            <div className="py-1 w-full"><input type="text" name="linktitle" id="linktitle" className="outline-none w-full bg-white" autoComplete="off" value={linktitle} onChange={(e)=>{setlinktitle(e.target.value)}}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Link</div>
                            <div className="py-1 w-full"><input type="text" name="link" id="link" className="outline-none w-full bg-white" autoComplete="off" value={link} onChange={(e)=>{setlink(e.target.value)}}/></div>
                        </div>
                    </div>
                    <div className='w-full mt-4 flex justify-center'>
                        <button className='bg-purple-600 text-white w-1/2 px-2 py-2 rounded-xl heading font-semibold' onClick={()=>{addNewLink()}}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PopupLinkForm;