import { useState } from 'react';
import crossIcon from '../images/closeIcon.svg'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
function PopupEducationForm({setidentifier,title,education,seteducation}){
    const [instname, setinstname] = useState('');
    const [coursename,setcoursename]=useState('');
    const [startyear,setstartyear]=useState('');
    const [endyear,setendyear]=useState('');
    const [grade,setgrade]=useState('');
    function closePopUp(){
        setinstname('');
        setcoursename('');
        setstartyear('');
        setendyear('');
        setgrade('');
        setidentifier(0);
    }
    function addNewEducationQualification(){
        try{
        let instnamelen=(instname.trim()).length;
        let coursenamelen=(coursename.trim()).length;
        let startyearlen=(String(startyear).trim()).length;
        let endyearlen=(String(endyear).trim()).length;
        let gradelen=(grade.trim()).length;
        let startyearvalue=new Date(startyear).getFullYear();
        let endyearvalue=new Date(endyear).getFullYear();
        if(instnamelen<=0){
            toast.error('Institute Name Is Required');
            return;
        }
        else if(coursenamelen<=0){
            toast.error('Course Name Is Required');
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
        else if(gradelen<=0){
            toast.error('Grade Is Required');
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
        else{
            let data={
                instname:instname,
                coursename:coursename,
                startyear:startyearvalue,
                endyear:endyearvalue,
                grade:grade
            }
           let cpyeducation=[...education];
           cpyeducation.push(data);
           seteducation(cpyeducation);
        }
        closePopUp();
        }
        catch(error){
            toast.error("Error In Adding Educational Qualification");
        }
    }
    return(
        <div className="w-screen h-screen fixed flex items-center justify-center bg-black bg-opacity-75 z-30 heading">
            <div className="w-1/2 min-h-[50%] max-h-max bg-white rounded-xl px-3 py-3">
                <div className='flex items-center justify-between border-b-2 border-purple-600 pb-3'>
                    <div className='text-2xl text-purple-600 heading font-semibold text-center'>{title}</div>
                    <div className='flex items-center'>
                        <img src={crossIcon} alt="close-icon" className='hover:cursor-pointer' onClick={()=>{closePopUp()}}/>
                    </div>
                </div>
                <div className='mt-4 flex flex-col justify-center'>
                    <div className='w-full flex flex-col items-center justify-center'>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Institute Name</div>
                            <div className="py-1 w-full"><input type="text" name="instname" id="instname" className="outline-none w-full bg-white" autoComplete="off" value={instname} onChange={(e)=>{setinstname(e.target.value)}}/></div>
                        </div>
                        <div className="border-2 border-purple-600 rounded px-3 py-1 w-3/4 my-2">
                            <div className="text-purple-600 font-medium">Course Name</div>
                            <div className="py-1 w-full"><input type="text" name="cname" id="cname" className="outline-none w-full bg-white" autoComplete="off" value={coursename} onChange={(e)=>{setcoursename(e.target.value)}}/></div>
                        </div>
                        <div className='flex w-3/4 gap-2'>
                            <div className="border-2 border-purple-600 rounded px-3 py-1 w-1/2 my-2">
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
                            <div className="border-2 border-purple-600 rounded px-3 py-1 w-1/2 my-2">
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
                            <div className="text-purple-600 font-medium">Grades</div>
                            <div className="py-1 w-full"><input type="text" name="grades" id="grades" className="outline-none w-full bg-white" autoComplete="off" value={grade} onChange={(e)=>{setgrade(e.target.value)}}/></div>
                        </div>
                    </div>
                    <div className='w-full mt-4 flex justify-center'>
                        <button className='bg-purple-600 text-white w-1/2 px-2 py-2 rounded-xl font-semibold' onClick={()=>{addNewEducationQualification()}}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PopupEducationForm;