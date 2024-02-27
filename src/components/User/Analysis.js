import { useState } from "react";
import rightArrow from '../../images/rightArrowIcon.svg'
function Analysis({assignment,sol}){
    const [selected,setselected]=useState(0);
    return(
        <div>
            {(assignment&& sol && assignment.questions && assignment.questions.length>0)?<div><div><span className="font-semibold bg-purple-600 text-white w-max px-2 py-1 rounded">Marks Scored - {sol.totalmarks} out of {assignment.questions.length*assignment.assignmentmark}</span></div>
            <div className="p-4 overflow-y-auto w-full my-2 flex gap-3 items-center justify-center">
                <div className="w-full flex items-center bg-slate-300 rounded-xl py-3 relative">
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===0)} onClick={()=>setselected((prev)=>prev-1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full rotate-180"/>
                            </button>
                        </div>
                        <div className="w-[80%] flex flex-col items-center">
                        <div className="font-semibold text-2xl py-2 break-words text-left">{"Question "+ (selected+1)}</div>
                        <div className="font-semibold text-2xl py-2 break-words">{assignment.questions[selected].question}</div>
                        <div className="font-semibold text-xl w-full flex flex-col items-center">
                            {
                                assignment.questions[selected].options.map((element,idx)=><div className={`w-[50%] rounded mb-3 p-2  hover:cursor-pointer  ${(element===assignment.questions[selected].correct_answer)?"text-white bg-green-600 border-2 border-green-600":(sol.solutions.status==="Wrong" && element===sol.solutions[selected].option)?"text-white bg-red-600 border-2 border-red-600":"border-2 border-purple-600"}`} key={idx}>{String.fromCharCode(65+idx)+". "+element}</div>)
                            }
                        </div>
                        </div>
                        <div className="absolute right-0 top-0 bg-purple-600 px-2 py-2 pl-4 rounded-l-full text-white font-semibold">
                            {sol.solutions[selected].status}
                        </div>   
                        <div className="w-[10%] flex justify-center">
                            <button className="bg-purple-600 rounded-full p-2 w-[70px] h-[70px] flex justify-center items-center hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400" disabled={(selected===(assignment.questions.length-1))?true:false} onClick={()=>setselected((prev)=>prev+1)}>
                                <img src={rightArrow} alt="arrow_icon" className="w-full h-full"/>
                            </button>
                        </div>
                    </div>
                    </div></div>:<div className="font-semibold text-center">Loading....</div>
            }
        </div>
    )
}
export default Analysis;