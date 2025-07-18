import UserSidebar from "@/components/Sidebar/UserSidebar";
import ProfilePage from "@/components/Profile_Page/Profile_Page";

const Profile =()=>{
    return(
        <>
        <div className=" min-h-screen bg-gray-100 flex">

        <UserSidebar/>
        <ProfilePage/>
        </div>
        </>
    )
}
export default Profile