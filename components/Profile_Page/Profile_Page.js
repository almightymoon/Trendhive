"use client";

import { useEffect, useState } from "react";
import { UserCircle, Edit } from "lucide-react";
import NotificationModal from "@/components/Notification/Notification";
import Bubbles from "../Bubble/Bubble";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [originalData, setOriginalData] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalMessage, setModalMessage] = useState("");

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
            console.log("Fetched user data:", data);
            setUser(data);
            setFormData({ name: data.name, email: data.email, phone: data.phone || "" });
            setOriginalData({ name: data.name, email: data.email, phone: data.phone || "" });
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
        setIsEditing(false);
    };

    if (loading) return <p className="text-center text-gray-600">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <>
            <Bubbles />
            <div className="min-h-screen bg-gray-100 flex">
                <div className="flex-1 p-8 md:p-12">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                                {user?.name ? (
                                    <div className="text-2xl font-bold text-gray-600">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <UserCircle size={96} className="text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">{user?.name || "N/A"}</h2>
                                <p className="text-gray-600">{user?.email || "N/A"}</p>
                                <p className="text-gray-600">{user?.phone || "N/A"}</p>
                            </div>
                        </div>

                        {isEditing ? (
                            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                                <div className="flex justify-end gap-4">
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
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
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