import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';
import userAvatar from '../../images/userAvatar.png';
import { toast } from 'react-toastify';
ChartJS.register(CategoryScale,LinearScale,BarElement,PointElement,LineElement,Title,Tooltip,Legend);

function Analysis({solutions,marks,queststats,setmarks,setqueststats,setsolutions}){
    const [linegraphoptions,setlinegraphoptions]=useState(null);
    const [linegraphdata,setlinegraphdata]=useState(null);
    const [bargraphoptions,setbargraphoptions]=useState(null);
    const [bargraphdata,setbargraphdata]=useState(null);
    const [showSpinner,setShowSpinner]=useState(false);
    const{id}=useParams();
    const navigate=useNavigate();
    useEffect(()=>{
        function init(){
            try{
                console.log(solutions);
                if(marks && marks.length>0 && queststats && queststats.length>0){
                    const linelabels=[...marks.map((element,idx)=>element.totalmarks)];
                    setlinegraphoptions({responsive: true,plugins: {  legend: {    position: 'top'  },  title: {    display: true,    text: 'Overall Marks of Applicants',  },},});
                    setlinegraphdata({labels:linelabels,datasets:[{label:"Marks",data:marks.map((element,idx)=>element.totalmarks),borderColor: 'rgb(255, 99, 132)',backgroundColor: 'rgba(255, 99, 132, 0.5)',}]})
                    const barlabels=queststats.map((element,idx)=>"Applicant "+(idx+1));
                    setbargraphoptions({responsive: true,plugins: {  legend: {    position: 'top'  },  title: {    display: true,    text: 'Applicant Statistics',  },},})
                    setbargraphdata({labels:barlabels,datasets:[{label:"Correct Answers",data:queststats.map((element,idx)=>element.status[0]),borderColor: 'rgb(22 ,163 ,74)',backgroundColor: 'rgba(22 ,163 ,74, 0.5)'},{label:"Not Attempted",data:queststats.map((element,idx)=>element.status[1]),borderColor: 'rgb(53, 162, 235)',backgroundColor: 'rgba(53, 162, 235, 0.5)'},{label:"Wrong Answers",data:queststats.map((element,idx)=>element.status[2]),borderColor: 'rgb(220, 38, 38)',backgroundColor: 'rgba(220, 38, 38, 0.5)'}]})
                }
            }
            catch(error){
                console.log(error);
            }
        }
        init();
    },[])
    async function unshortlist(element,idx){
        try{
                let storage=localStorage.getItem('storage');
                storage=await JSON.parse(storage);
                if(storage && storage.auth){
                setShowSpinner(true);
                let uid=element.userId.userId;
                let idx1=marks.findIndex((element)=>element.userId===uid);
                let idx2=queststats.findIndex((element)=>element.userId===uid);
                let idx3=idx;
                if(idx1>=0 && idx2>=0 && idx3>=0){
                let tmpmarks=[...marks];
                tmpmarks.splice(idx1,1);
                let tmpqueststats=[...queststats];
                tmpqueststats.splice(idx2,1);
                let tmpsolution=[...solutions];
                tmpsolution.splice(idx3,1);
                let source=1;
                const resp=await fetch(`${process.env.REACT_APP_BACKEND_URL}/job/unshortlist/${id}/${uid}`,{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-type":"application/json",
                        "authToken":storage.auth
                    },
                    body:JSON.stringify({source})
                })
                const msg=await resp.json();
                if(msg && msg.success){
                    toast.success(msg.success);
                    setmarks(tmpmarks);
                    setqueststats(tmpqueststats);
                    setsolutions(tmpsolution);
                    setShowSpinner(false);
                }
                else if(msg && msg.error){
                    throw msg.error;
                }
                else{
                    throw 'Some Error Occured';
                }
            }
        }
        else{
            navigate('/');
        }
        }
        catch(error){
            toast.error(error);
            setShowSpinner(false);
        }
    }
    return(
        <div className='w-full h-full'>
            <div className='font-semibold text-purple-600 text-xl'>Analysis</div>
            <div className='w-full flex'>
                <div className='w-1/2 border-r-2 border-gray-600'>
                    {(marks && marks.length>0)?<div className='w-full'><div className='w-full flex justify-center'>{(linegraphdata && linegraphoptions)?<div><Line options={linegraphoptions} data={linegraphdata}/></div>:<></>}</div>
                        </div>:<></>
                    }
                </div>
                <div className='w-1/2'>
                    {
                    (queststats&&queststats.length>0)?<div className='w-full'><div className='w-full flex justify-center'>{(bargraphdata && bargraphoptions)?<div><Bar options={bargraphoptions} data={bargraphdata}/></div>:<></>}</div></div>:<></>
                     }
                </div>
            </div>
            <div>
                {
                    (marks && marks.length>0)?<div className='w-full flex bg-purple-600 p-2 text-white rounded font-semibold my-2'>
                    <div className='w-1/3 text-center border-r-4 border-white'>Minimum Marks : {Math.min(...marks.map((element,idx)=>element.totalmarks))}</div>
                    <div className='w-1/3 text-center border-r-4 border-white'>Average Marks : {marks.map((element,idx)=>element.totalmarks).reduce((a,b)=>a+b)/marks.length}</div>
                    <div className='w-1/3 text-center'>Maximum Marks : {Math.max(...marks.map((element,idx)=>element.totalmarks))}</div>
                </div>:<></>
                }
            </div>
           <div>
                {(solutions && solutions.length>0)?<div>
                    <div className='font-semibold text-purple-600 text-xl my-2 mt-3'>Applicant Wise Marks</div>
                    <div className='w-full flex gap-2 flex-wrap'>
                    {
                        solutions.map((element,idx)=><div className='w-1/3 bg-slate-300 rounded-xl px-3 py-3 relative' key={idx}>
                            <div className="flex items-center gap-3">
                                <div className="w-[70px] h-[70px] rounded-full">
                                    <img src={(element.userId.profileImg)?element.userId.profileImg:userAvatar} alt="icon" className="w-full h-full rounded-full border-2 border-purple-600"/>
                                </div>
                                <div className="font-semibold">
                                    <div className="capitalize">{element.userId.fname+" "+element.userId.lname}</div>
                                </div>   
                            </div>
                            <div className="flex w-full gap-2 items-center justify-center">
                                <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>{navigate(`/recruiter/userprofile/${element.userId.userId}/${id}`)}}>View Profile</div>
                                <div className="w-1/2 bg-purple-600 my-2 py-2 text-center text-white rounded hover:cursor-pointer text-sm" onClick={()=>unshortlist(element,idx)}>{(showSpinner)?<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>:<></>}Unshortlist</div>
                            </div>
                            <div className='absolute right-0 top-0 bg-purple-600 px-2 py-2 pl-4 rounded-l-full text-white font-semibold '>
                                Marks : {element.totalmarks}
                            </div>
                    </div>
                    )
                    }
                    </div>
                </div>:<></>}
           </div>

        </div>
    )
}
export default Analysis;