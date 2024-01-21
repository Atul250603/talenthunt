import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { useState } from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes,Route } from 'react-router-dom';
import Profile from './components/User/Profile';
import User from './components/User/User';
import Projects from './components/User/Projects';
import AllProjects from './components/User/AllProjects';
import MyProjects from './components/User/MyProjects';
import MyProjectPage from './components/User/MyProjectPage';
import RequestPage from './components/User/RequestPage';
import Chat from './components/User/Chat';
import AppliedProjects from './components/User/AppliedProjects';
import ProjectPage from './components/User/ProjectPage';
import Error404 from './components/Error404';
import Hackathon from './components/Hackathons/Hackathon';
import OrganizerProfile from './components/Hackathons/Profile';
import RecruiterProfile from './components/Job/Profile';
import MyHackathon from './components/Hackathons/MyHackathons';
import Hackathons from './components/User/Hackathons';
import AllHackathons from './components/User/AllHackathons';
import AppliedHackathons from './components/User/AppliedHackathons';
import HackathonPage from './components/User/HackathonPage';
import MyHackathonPage from './components/Hackathons/MyHackathonPage';
import Job from './components/Job/Job';
import MyJobs from './components/Job/MyJobs';
import MyJobPage from './components/Job/MyJobPage';
function App() {
  const [loginDisplay, setloginDisplay] = useState(false);
  const [signupDisplay, setsignupDisplay] = useState(false);
  const [allProjects,setallProjects]=useState([]);
  const [myProject,setmyProject]=useState([]);
  return (
    <div className='overflow-x-hidden'>
      <ToastContainer
        autoClose={2000}
        theme='dark'
      />
      <Routes>
          <Route  exact path='/' element={<><Navbar setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
            <Home loginDisplay={loginDisplay} signupDisplay={signupDisplay} setloginDisplay={setloginDisplay} setsignupDisplay={setsignupDisplay}/>
            <Footer/></>}/>
          <Route exact path="/user" element={<User/>}>
            <Route  exact path="profile" element={<Profile/>}/>
            <Route  exact path="projects" element={<Projects myProject={myProject} setmyProject={setmyProject}/>}>
              <Route index element={<AllProjects allProjects={allProjects} setallProjects={setallProjects}/>} />
              <Route exact path="myprojects" element={<MyProjects myProject={myProject} setmyProject={setmyProject}/>}/>
              <Route exact path="myprojects/:id" element={<MyProjectPage/>}/>
              <Route exact path="myprojects/:id/u/:uid" element={<RequestPage/>}/>
              <Route exact path="appliedprojects" element={<AppliedProjects/>}/>
              <Route exact path="projectpage/:id" element={<ProjectPage/>}/>
            </Route>
            <Route exact path="hackathons" element={<Hackathons/>}>
              <Route index element={<AllHackathons/>} />
              <Route exact path="applied" element={<AppliedHackathons/>}/>
              <Route exact path="applied/:id" element={<HackathonPage/>}/>
            </Route>
            <Route exact path="chat/:pid/:uid" element={<Chat/>}/>
        </Route>
        <Route exact path="/org" element={<Hackathon/>}>
          <Route exact path="profile" element={<OrganizerProfile/>}></Route>
          <Route exact path="hackathons" element={<MyHackathon/>}/>
          <Route exact path="hackathons/:id" element={<MyHackathonPage/>}/>
        </Route>
        <Route eaxct path="/recruiter" element={<Job/>}>
          <Route exact path="jobs" element={<MyJobs/>}></Route>
          <Route exact path="jobs/:id" element={<MyJobPage/>}></Route>
          <Route exact path="profile" element={<RecruiterProfile/>}></Route>
        </Route>
        <Route exact path="*" element={<Error404/>}/>
      </Routes>
    </div>
  );
}

export default App;
