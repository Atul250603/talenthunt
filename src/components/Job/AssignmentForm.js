import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
function AssignmentForm({setdisabled,setdata}){
    const [name,setname]=useState('');
    const [date,setdate]=useState('');
    const [duration,setduration]=useState('');
    const [mark,setmark]=useState('');
    const [negativemarking,setnegativemarking]=useState(false);
    let localnegativemarking=negativemarking;
    function validate(name,date,duration,mark,e,caller){
        try{
            let namelen=(name.trim()).length;
            let durationlen=(duration.trim()).length;
            let marklen=(mark.trim()).length;
            let datelen=(String(date).trim()).length;
            let dateval=new Date(date);
            if(caller===1 && namelen<=0){
                throw 'Assignment Name Is Required';
            }
            if(caller===2 && datelen<=0){
                throw 'Assignment Date Is Required';
            }
            if((caller===2) && (dateval.toLocaleDateString()<=(new Date().toLocaleDateString()))){
                throw 'Assignment Date Must Be A Future Date';
            }
            if(caller===3 && durationlen<=0){
                throw 'Assignment Duration Is Required';
            }
            if(caller===3 &&  duration.match(/^[0-9]+$/) === null){
                throw 'Assignment Duration Must Be A Number';
            }
            if(caller===3 && Number(duration)<=0){
                throw 'Assignment Duration Must Be Greater Than 0';
            }
            if(caller===4 && marklen<=0){
                throw 'Question Weightage Is Required';
            }
            if(caller===4 &&  mark.match(/^[0-9]+$/) === null){
                throw 'Question Weightage Must Be A Number';
            }
            if(caller===4 && Number(mark)<=0){
                throw 'Question Weightage Must Be Greater Than 0';
            }
            if(caller===5){
                localnegativemarking=!negativemarking;
            }
            if(namelen>0 && datelen>0 && dateval.toLocaleDateString()>(new Date().toLocaleDateString()) && durationlen>0 & marklen>0 && duration.match(/^[0-9]+$/) !== null && Number(duration)>0 && mark.match(/^[0-9]+$/) !== null && Number(mark)>0){
                setdata((prev)=>({...prev,assignmentname:name,assignmentdate:date,assignmentduration:duration,assignmentmark:mark,negativemarking:localnegativemarking}));
                setdisabled(false);
            }
        }
        catch(error){
            setdisabled(true);
            toast.error(error,{
                toastId:"formerrorid1"
            });
        }
    }
    return(
        <div className='w-full flex justify-center h-max'>
            <div className='w-1/2 overflow-y-auto flex flex-col items-center'>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full font-semibold my-2">
                    <div className="text-purple-600 font-semibold">Assignment Name</div>
                    <div className="py-1 w-full">
                        <input name='assignmentname' id='assignmentname' value={name} onChange={(e)=>{setname(e.target.value);validate(e.target.value,date,duration,mark,1);}} className='resize-none outline-none w-full bg-slate-500 text-white p-2'/> 
                    </div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full font-semibold my-2">
                    <div className="text-purple-600 font-semibold">Assignment Date</div>
                    <div className="py-1 w-full">
                        <DatePicker
                            selected={date}
                            onChange={(value)=>{setdate(value);validate(name,value,duration,mark,2);}}
                            showTimeSelect
                            dateFormat="Pp"
                            wrapperClassName='w-full'
                            className='p-2 resize-none outline-none w-full bg-slate-500 text-white'
                        /> 
                    </div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full font-semibold my-2">
                    <div className="text-purple-600 font-semibold">Assignment Duration In Hours</div>
                    <div className="py-1 w-full">
                        <input name='duration' id='duration' value={duration} onChange={(e)=>{setduration(e.target.value);validate(name,date,e.target.value,mark,3);}} className='resize-none outline-none w-full bg-slate-500 text-white p-2'/> 
                    </div>
                </div>
                <div className="border-2 border-purple-600 rounded px-3 py-1 w-full font-semibold my-2">
                    <div className="text-purple-600 font-semibold">Question Weightage</div>
                    <div className="py-1 w-full">
                        <input name='marks' id='marks' value={mark} onChange={(e)=>{setmark(e.target.value);validate(name,date,duration,e.target.value,4);}} className='resize-none outline-none w-full bg-slate-500 text-white p-2'/> 
                    </div>
                </div>
                <div className='py-1 w-1/2 my-2 flex items-center justify-between'>
                    <div className="font-semibold text-purple-600 dark:text-gray-300">Negative Marking</div>
                    <div className='flex items-center justify-center'>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value={negativemarking} class="sr-only peer" onClick={(e)=>{setnegativemarking((prev)=>!prev); validate(name,date,duration,mark,e,5)}}/>
                            <div className="w-11 h-6 bg-slate-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AssignmentForm;
