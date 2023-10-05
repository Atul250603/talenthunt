import { useState } from 'react';
import crossIcon from '../images/closeIcon.svg'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
function PopupWorkForm({setidentifier,title,work,setwork}){
    const [compname, setcompname] = useState('');
    const [rolename, setrolename] = useState('');
    const [startyear, setstartyear] = useState('');
    const [endyear, setendyear] = useState('');
    const [jobdesc, setjobdesc] = useState('');
    function closePopUp(){
        setcompname('');
        setrolename('');
        setstartyear('');
        setendyear('');
        setjobdesc('');
        setidentifier(0);
    }
    function addNewWorkExp(){
        let compnamelen=(compname.trim()).length;
        let rolenamelen=(rolename.trim()).length;
        let startyearlen=(String(startyear).trim()).length;
        let endyearlen=(String(endyear).trim()).length;
        let jobdesclen=(jobdesc.trim()).length;
        let startyearvalue=new Date(startyear).getFullYear();
        let endyearvalue=new Date(endyear).getFullYear();
        if(compnamelen<=0){
            toast.error('Company Name Is Required');
            return;
        }
        else if(rolenamelen<=0){
            toast.error('Job Role Is Required');
            return;
        }
        else if(startyearlen<=0){
            toast.error('Start Year Is Required');
            return;
        }
        else if(endyearlen<=0){
            toast.error('End Year Is Required');
            return;
        }
        else if(jobdesclen<=0){
            toast.error('Job Description Is Required');
            return;
        }
        else if(endyearvalue<startyearvalue){
            toast.error('End Year Value Should Be Greater Than Start Year');
            return;
        }
        else if(startyearvalue>new Date().getFullYear()){
            toast.error("Start Year Can't Be In Future");
            return;
        }
        else if(endyearvalue>new Date().getFullYear()){
            toast.error("End Year Can't Be In Future");
            return;
        }
        else{
            let data={
                companyname:compname,
                rolename:rolename,
                startyear:startyearvalue,
                endyear:endyearvalue,
                jobdesc:jobdesc
            }
           let cpywork=[...work];
           cpywork.push(data);
           setwork(cpywork);
        }
        closePopUp();
    }
    return(
        <div className="w-screen h-screen fixed flex items-center justify-center bg-black bg-opacity-75 z-30 heading">
            <div className="w-1/2 min-h-[50%] max-h-max bg-white rounded-xl px-3 py-3">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-3xl text-purple-600 heading font-semibold text-center'>{title}</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-4 flex flex-col justify-center'>
                    <div className='w-full flex flex-col items-center'>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Company Name</div>
                            <div className="py-1 w-full"><input type="text" name="compname" id="compname" className="outline-none w-full bg-white" autoComplete="off" value={compname} onChange={(e)=>{setcompname(e.target.value)}}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Role Name</div>
                            <div className="py-1 w-full"><input type="text" name="rolename" id="rolename" className="outline-none w-full bg-white" autoComplete="off" value={rolename} onChange={(e)=>{setrolename(e.target.value)}}/></div>
                        </div>
                        <div className='flex gap-2 items-center justify-center w-3/4 my-2'>
                            <div className="border-2 border-purple-600 rounded px-3 py-1 w-1/2">
                                <div className="text-purple-600 font-medium">Start Year</div>
                                <div className="py-1 w-full">
                                    <DatePicker
                                        selected={startyear}
                                        onChange={(date) => setstartyear(date)}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        
                                    />
                                </div>
                            </div>
                            <div className="border-2 border-purple-600 rounded px-3 py-1 w-1/2">
                                <div className="text-purple-600 font-medium">End Year</div>
                                <div className="py-1 w-full">
                                    <DatePicker
                                        selected={endyear}
                                        onChange={(date) => setendyear(date)}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        
                                    />    
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Job Description</div>
                            <div className="py-1 w-full"><input type="text" name="jobdesc" id="jobdesc" className="outline-none w-full bg-white" autoComplete="off" value={jobdesc} onChange={(e)=>{setjobdesc(e.target.value)}}/></div>
                        </div>
                    </div>
                    <div className='w-full mt-4 flex justify-center'>
                        <button className='bg-purple-600 text-white w-1/2 px-2 py-2 rounded-xl heading font-semibold' onClick={()=>{addNewWorkExp()}}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PopupWorkForm;