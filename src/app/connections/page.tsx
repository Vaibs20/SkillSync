"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Connection {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        branch?: string;
        passing_year?: number;
        known_skills?: string[];
        career_path?: string[];
    };
    status: string;
    createdAt: string;
    isSender: boolean;
}

export default function Connections() {
    const [activeTab, setActiveTab] = useState<"accepted" | "pending">("accepted");
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchConnections = async (status: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/connections?status=${status}`);
            setConnections(res.data.connections);
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to fetch connections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections(activeTab);
    }, [activeTab]);

    const handleAccept = async (connectionId: string) => {
        try {
            await axios.patch(`/api/connections/${connectionId}`, { action: "accept" });
            toast.success("Connection accepted!");
            fetchConnections(activeTab);
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to accept connection");
        }
    };

    const handleReject = async (connectionId: string) => {
        try {
            await axios.patch(`/api/connections/${connectionId}`, { action: "reject" });
            toast.success("Connection rejected!");
            fetchConnections(activeTab);
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to reject connection");
        }
    };

    const handleRemove = async (connectionId: string) => {
        try {
            await axios.delete(`/api/connections/${connectionId}`);
            toast.success("Connection removed!");
            fetchConnections(activeTab);
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to remove connection");
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Network</h1>
                    <p className="text-purple-200 text-lg">
                        Manage your connections and requests
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <Button
                        onClick={() => setActiveTab("accepted")}
                        variant={activeTab === "accepted" ? "primary" : "outline"}
                        className={activeTab === "accepted" ? "" : "border-white/30 text-white hover:bg-white/10"}
                    >
                        My Connections
                    </Button>
                    <Button
                        onClick={() => setActiveTab("pending")}
                        variant={activeTab === "pending" ? "primary" : "outline"}
                        className={activeTab === "pending" ? "" : "border-white/30 text-white hover:bg-white/10"}
                    >
                        Pending Requests
                    </Button>
                </div>

                {/* Connections List */}
                {loading ? (
                    <Card className="p-12 text-center" gradient>
                        <div className="text-white text-xl">Loading...</div>
                    </Card>
                ) : connections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {connections.map((connection) => (
                            <Card key={connection._id} className="p-6" gradient>
                                <Link href={`/profile/${connection.user._id}`}>
                                    <div className="flex items-center gap-4 mb-4 cursor-pointer">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {connection.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">{connection.user.name}</h3>
                                            <p className="text-purple-200 text-sm">{connection.user.email}</p>
                                        </div>
                                    </div>
                                </Link>
                                
                                <div className="space-y-2 text-sm mb-4">
                                    <p className="text-purple-200">
                                        <strong className="text-white">Department:</strong> {connection.user.branch || "N/A"}
                                    </p>
                                    <p className="text-purple-200">
                                        <strong className="text-white">Skills:</strong> {connection.user.known_skills?.slice(0, 3).join(", ") || "None"}
                                        {connection.user.known_skills && connection.user.known_skills.length > 3 && "..."}
                                    </p>
                                </div>
                                
                                <div className="pt-4 border-t border-white/20 space-y-2">
                                    {activeTab === "pending" && !connection.isSender && (
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => handleAccept(connection._id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 border-white/30 text-white hover:bg-white/10"
                                                onClick={() => handleReject(connection._id)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                    {activeTab === "pending" && connection.isSender && (
                                        <p className="text-purple-200 text-sm text-center">Request sent</p>
                                    )}
                                    {activeTab === "accepted" && (
                                        <div className="space-y-2">
                                            <Link href={`/messages?userId=${connection.user._id}`}>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm" 
                                                    className="w-full"
                                                >
                                                    Message
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full border-white/30 text-white hover:bg-red-500/20"
                                                onClick={() => handleRemove(connection._id)}
                                            >
                                                Remove Connection
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center" gradient>
                        <div className="text-6xl mb-4">🔗</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {activeTab === "accepted" ? "No Connections Yet" : "No Pending Requests"}
                        </h3>
                        <p className="text-purple-200">
                            {activeTab === "accepted" 
                                ? "Start connecting with other students to build your network!"
                                : "You don't have any pending connection requests."
                            }
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}
