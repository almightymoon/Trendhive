"use client";

import Link from "next/link";
import { Home, UserCircle, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const NotificationModal = dynamic(() => import("../Notification/Notification"), { ssr: false });

const Sidebar = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 🔥 Notification Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("success"); // "success" | "error"
    const [modalMessage, setModalMessage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);

        // ✅ Show Logout Success Notification
        setModalType("success");
        setModalMessage("You have been logged out successfully.");
        setModalOpen(true);

        // ✅ Redirect after 1.5 seconds
        setTimeout(() => {
            setModalOpen(false);
            router.push("/");
        }, 1500);
    };

    return (
        <div className={`bg-white shadow-md transition-width duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"} p-6`}>
            {/* 🔥 Notification Modal */}
            <NotificationModal isOpen={modalOpen} setIsOpen={setModalOpen} type={modalType} message={modalMessage} />

            {/* Toggle Button */}
            <button
                className="flex items-center gap-3 mb-3"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRight size={20} />
                ) : (
                    <ChevronLeft size={20} />
                )}
            </button>

            {/* Logo and App Name */}
            <Link href="/" className="cursor-pointer">
                <h1 className={`pb-10 text-3xl font-extrabold bg-gradient-to-r from-green-500 via-green-700 to-green-500 bg-clip-text text-transparent animate-gradient tracking-wide ${isCollapsed ? "hidden" : ""}`}>
                    {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
            </Link>

            <h2 className={`text-xl font-bold text-gray-800 mb-6 ${isCollapsed ? "hidden" : ""}`}>Dashboard</h2>
            <nav className="space-y-3">
                <Link href="/" className="flex items-center gap-3">
                    <Home size={20} />
                    {!isCollapsed && "Home"}
                </Link>
                <Link href="/profile" className="flex items-center gap-3 text-green-600 font-semibold">
                    <UserCircle size={20} />
                    {!isCollapsed && "Profile"}
                </Link>
                <Link href="/settings" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
                    <Settings size={20} />
                    {!isCollapsed && "Settings"}
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 text-gray-700 hover:text-green-600 transition-all duration-200"
                >
                    <LogOut size={20} />
                    {!isCollapsed && "Logout"}
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;