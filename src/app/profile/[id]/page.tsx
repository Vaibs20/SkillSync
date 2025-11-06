// src / app / profile / [id] / page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "../profileform";
import ProfileImage from "../profileimage";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [isEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>("none");
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [isSender, setIsSender] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current user
        axios.get("/api/auth/verify").then((res) => {
            if (res.data.success) {
                setCurrentUserId(res.data.user.id);
            }
        }).catch(() => {
            // User not authenticated, that's okay for viewing profiles
        });

        // Fetch profile data
        axios.get(`/api/users/${params.id}`).then((res) => {
            setName(res.data.name);
            setBio(res.data.learning_goal || "");
            setSkills(res.data.known_skills.join(", "));
        });
    }, [params.id]);

    useEffect(() => {
        if (currentUserId && currentUserId !== params.id) {
            // Check connection status
            axios.get(`/api/connections/status?userId=${params.id}`)
                .then((res) => {
                    setConnectionStatus(res.data.status);
                    if (res.data.connection) {
                        setConnectionId(res.data.connection._id);
                        setIsSender(res.data.connection.isSender);
                    }
                })
                .catch(() => {
                    // Ignore errors
                });
        }
    }, [currentUserId, params.id]);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await axios.post("/api/connections", { receiverId: params.id });
            toast.success("Connection request sent!");
            setConnectionStatus("pending");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to send connection request");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!connectionId) return;
        setLoading(true);
        try {
            await axios.patch(`/api/connections/${connectionId}`, { action: "accept" });
            toast.success("Connection accepted!");
            setConnectionStatus("accepted");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to accept connection");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!connectionId) return;
        setLoading(true);
        try {
            await axios.patch(`/api/connections/${connectionId}`, { action: "reject" });
            toast.success("Connection rejected!");
            setConnectionStatus("rejected");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to reject connection");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!connectionId) return;
        setLoading(true);
        try {
            await axios.delete(`/api/connections/${connectionId}`);
            toast.success("Connection removed!");
            setConnectionStatus("none");
            setConnectionId(null);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to remove connection");
        } finally {
            setLoading(false);
        }
    };

    const renderConnectionButton = () => {
        // Don't show button if viewing own profile
        if (!currentUserId || currentUserId === params.id) {
            return null;
        }

        if (loading) {
            return (
                <button
                    className="mt-6 w-full py-3 rounded-lg text-white font-semibold bg-gray-400 cursor-not-allowed"
                    disabled
                >
                    Processing...
                </button>
            );
        }

        switch (connectionStatus) {
            case "none":
                return (
                    <button
                        className="mt-6 w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleConnect}
                    >
                        Connect
                    </button>
                );
            case "pending":
                if (isSender) {
                    return (
                        <div className="mt-6">
                            <button
                                className="w-full py-3 rounded-lg text-white font-semibold bg-gray-500 cursor-not-allowed"
                                disabled
                            >
                                Request Sent
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <div className="mt-6 flex gap-2">
                            <button
                                className="flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700"
                                onClick={handleAccept}
                            >
                                Accept
                            </button>
                            <button
                                className="flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </div>
                    );
                }
            case "accepted":
                return (
                    <div className="mt-6 space-y-2">
                        <div className="py-2 px-4 rounded-lg bg-green-100 text-green-800 font-semibold text-center">
                            ✓ Connected
                        </div>
                        <button
                            className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => router.push(`/messages?userId=${params.id}`)}
                        >
                            Message
                        </button>
                        <button
                            className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700"
                            onClick={handleRemove}
                        >
                            Remove Connection
                        </button>
                    </div>
                );
            case "rejected":
                return (
                    <div className="mt-6">
                        <button
                            className="w-full py-3 rounded-lg text-white font-semibold bg-gray-500 cursor-not-allowed"
                            disabled
                        >
                            Request Rejected
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen p-4">
            <div className="bg-[#a0a7c7] p-12 rounded-2xl shadow-lg w-[400px] h-auto text-center ml-10 absolute left-10 top-22">
                <ProfileImage image={profileImage} setImage={setProfileImage} isEditing={isEditing} />
                <ProfileForm
                    name={name}
                    setName={setName}
                    bio={bio}
                    setBio={setBio}
                    skills={skills}
                    setSkills={setSkills}
                    isEditing={isEditing}
                />
                {renderConnectionButton()}
            </div>
        </div>
    );
};

export default Profile;