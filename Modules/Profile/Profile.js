import Sidebar from "@/components/Sidebar/Sidebar";
import ProfilePage from "@/components/Profile_Page/Profile_Page";

const Profile =()=>{
    return(
        <>
        <div className=" min-h-screen bg-gray-100 flex">

        <Sidebar/>
        <ProfilePage/>
        </div>
        </>
    )
}
export default Profile