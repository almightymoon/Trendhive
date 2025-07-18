"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircle, Edit, Camera } from "lucide-react";
import NotificationModal from "@/components/Notification/Notification";
import Bubbles from "../Bubble/Bubble";
import UserSidebar from "@/components/Sidebar/UserSidebar";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", country: "", avatar: "" });
    const [originalData, setOriginalData] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", country: "", avatar: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const avatarInputRef = useRef();

    // Fetch user data
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch user");

            const data = await res.json();
            setUser(data);
            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                country: data.country || "",
                avatar: data.avatar || ""
            });
            setOriginalData({
                name: data.name,
                email: data.email,
                phone: data.phone || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                country: data.country || "",
                avatar: data.avatar || ""
            });
            setAvatarPreview(data.avatar || "");
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Optionally, upload to server or just preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
            setFormData((prev) => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const isFormChanged = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormChanged()) {
            setModalOpen(true);
            setModalType("info");
            setModalMessage("Nothing changed!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found");
                return;
            }

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Error response from API:", errorData);
                setModalOpen(true);
                setModalType("error");
                setModalMessage(errorData.message || "Failed to update profile");
                return;
            }

            await fetchUser(); // Fetch updated user data immediately
            setIsEditing(false);
            setModalOpen(true);
            setModalType("success");
            setModalMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setModalOpen(true);
            setModalType("error");
            setModalMessage("Failed to update profile. Please try again later.");
        }
    };

    const handleCancelEdit = () => {
        setFormData(originalData);
        setAvatarPreview(originalData.avatar || "");
        setIsEditing(false);
    };

    if (loading) return <p className="text-center text-gray-600">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <>
            <Bubbles />
            <div className="min-h-screen bg-gray-100 flex">
                <UserSidebar />
                <div className="flex-1 p-8 md:p-12 pt-16 md:ml-64 max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                            <div className="relative w-28 h-28 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden group">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="object-cover w-full h-full" />
                                ) : user?.name ? (
                                    <div className="text-3xl font-bold text-gray-600">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <UserCircle size={96} className="text-gray-400" />
                                )}
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-2 shadow hover:bg-green-700 focus:outline-none"
                                        onClick={() => avatarInputRef.current.click()}
                                        aria-label="Change avatar"
                                    >
                                        <Camera size={18} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={avatarInputRef}
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">{user?.name || "N/A"}</h2>
                                <p className="text-gray-600">{user?.email || "N/A"}</p>
                                <p className="text-gray-600">{user?.phone || "N/A"}</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">Name</span>
                                        <span className="block text-gray-800 font-semibold">{user?.name || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">Email</span>
                                        <span className="block text-gray-800 font-semibold">{user?.email || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">Phone</span>
                                        <span className="block text-gray-800 font-semibold">{user?.phone || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">Address</span>
                                        <span className="block text-gray-800 font-semibold">{user?.address || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">City</span>
                                        <span className="block text-gray-800 font-semibold">{user?.city || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">State</span>
                                        <span className="block text-gray-800 font-semibold">{user?.state || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-sm mb-1">Country</span>
                                        <span className="block text-gray-800 font-semibold">{user?.country || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                        {modalOpen && (
                            <NotificationModal
                                isOpen={modalOpen}
                                setIsOpen={setModalOpen}
                                type={modalType}
                                message={modalMessage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;