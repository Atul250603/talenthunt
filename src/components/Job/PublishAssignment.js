import { useState } from "react";
import rightArrow from '../../images/rightArrowIcon.svg'
function PublishAssignment({data}){
    const [selected,setselected]=useState(0);
    return (
        <div className="w-full h-max">
    {(data)?<div>
        <div className="font-semibold text-purple-600 text-2xl text-center my-2">{data.assignmentname}</div>
        <div className="flex gap-3 mb-2 flex-wrap">
        <div className="flex gap-2 font-semibold">
        <div className="text-purple-600">Assignment Date - </div>
        <div>{new Date(data.assignmentdate).toLocaleString()}</div>
        </div>
        <div className="flex gap-2 font-semibold">
        <div className="text-purple-600">Assignment Duration - </div>
        <div>{data.assignmentduration} hrs</div>
        </div>
        <div className="flex gap-2 font-semibold">
        <div className="text-purple-600">Question Weightage - </div>
        <div>{data.assignmentmark} Mark</div>
        </div>
        <div className="flex gap-2 font-semibold">
        <div className="text-purple-600">Negative Marking - </div>
        <div>{(data.negativemarking)?"Yes":"No"}</div>
        </div>
        </div>
        <div>
        {
                (data.questions && data.questions.length>0)?<div className="w-full h-full flex justify-center">
                    
                    <div className="p-4 overflow-y-auto w-[85%] bg-slate-300 rounded-xl flex gap-3 items-center justify-center relative">
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===0)} onClick={()=>setselected((prev)=>prev-1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full rotate-180"/>
                            </button>
                        </div>
                        <div className="w-[80%] flex flex-col items-center">
                        <div className="font-semibold text-2xl py-2 break-words text-left">{"Question "+ (selected+1)}</div>
                        <div className="font-semibold text-2xl py-2 break-words">{data.questions[selected].question}</div>
                        <div className="font-semibold text-xl w-full flex flex-col items-center">
                            {
                                data.questions[selected].options.map((element,idx)=><div className={`w-[50%] rounded mb-3 p-2 ${(element===data.questions[selected].correct_answer)?"border-2 border-green-600 text-white bg-green-600":"border-2 border-red-600"}`} key={idx}>{String.fromCharCode(65+idx)+". "+element}</div>)
                            }
                        </div>
                        </div>
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===(data.questions.length-1))?true:false} onClick={()=>setselected((prev)=>prev+1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full"/>
                            </button>
                        </div>
                    </div>
                    
                    </div>:<div className="text-semibold flex items-center justify-center">Loading.....</div>
            }
        </div>
    </div>:<div className="font-semibold flex justify-center items-center">Loading....</div>}
    </div>
    )
}
export default PublishAssignment;