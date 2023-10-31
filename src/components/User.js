import { Outlet } from "react-router-dom";
import Sidepanel from "./Sidepanel";

function User(){
    return(
        <div className="w-full min-h-screen max-h-auto bg-slate-100 flex relative">
            <Sidepanel/>
            <Outlet/>
        </div>
    )
}
export default User;