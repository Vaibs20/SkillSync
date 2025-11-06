"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Configuration
const MESSAGE_POLL_INTERVAL = 5000; // 5 seconds

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
    };
    receiver: {
        _id: string;
        name: string;
        email: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
}

interface Conversation {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    lastMessage: string;
    lastMessageDate: string;
    unread: boolean;
}

function MessagesContent() {
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchConversations();
        
        // Check if userId is in query params
        const userIdParam = searchParams.get("userId");
        if (userIdParam) {
            setSelectedUserId(userIdParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (selectedUserId) {
            fetchMessages(selectedUserId);
            // Poll for new messages
            const interval = setInterval(() => {
                fetchMessages(selectedUserId, true);
            }, MESSAGE_POLL_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [selectedUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await axios.get("/api/auth/verify");
            setCurrentUserId(res.data.user.id);
        } catch {
            toast.error("Failed to fetch user info");
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await axios.get("/api/messages/conversations");
            setConversations(res.data.conversations);
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to fetch conversations");
        }
    };

    const fetchMessages = async (userId: string, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await axios.get(`/api/messages?userId=${userId}`);
            setMessages(res.data.messages);
        } catch (error) {
            if (!silent) {
                const err = error as { response?: { data?: { error?: string } } };
                toast.error(err.response?.data?.error || "Failed to fetch messages");
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUserId) return;

        setSending(true);
        try {
            await axios.post("/api/messages", {
                receiverId: selectedUserId,
                content: newMessage
            });
            setNewMessage("");
            fetchMessages(selectedUserId, true);
            fetchConversations();
        } catch (error) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const selectedConversation = conversations.find(c => c.user._id === selectedUserId);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Messages</h1>
                    <p className="text-purple-200 text-lg">
                        Chat with your connections
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                    {/* Conversations List */}
                    <Card className="p-6 overflow-hidden flex flex-col" gradient>
                        <h2 className="text-xl font-bold text-white mb-4">Conversations</h2>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {conversations.length > 0 ? (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.user._id}
                                        onClick={() => setSelectedUserId(conv.user._id)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                                            selectedUserId === conv.user._id
                                                ? "bg-white/20"
                                                : "bg-white/5 hover:bg-white/10"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {conv.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white font-semibold truncate">
                                                        {conv.user.name}
                                                    </h3>
                                                    {conv.unread && (
                                                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className="text-purple-200 text-sm truncate">
                                                    {conv.lastMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-purple-200">No conversations yet</p>
                                    <Link href="/connections" className="text-purple-300 hover:text-white text-sm mt-2 inline-block">
                                        Connect with users to start chatting
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Messages Area */}
                    <Card className="lg:col-span-2 p-6 flex flex-col overflow-hidden" gradient>
                        {selectedUserId ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center gap-4 pb-4 border-b border-white/20 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                        {selectedConversation?.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {selectedConversation?.user.name}
                                        </h2>
                                        <p className="text-purple-200 text-sm">
                                            {selectedConversation?.user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <p className="text-white">Loading messages...</p>
                                        </div>
                                    ) : messages.length > 0 ? (
                                        messages.map((message) => {
                                            const isSender = message.sender._id === currentUserId;
                                            return (
                                                <div
                                                    key={message._id}
                                                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] p-3 rounded-lg ${
                                                            isSender
                                                                ? "bg-purple-500 text-white"
                                                                : "bg-white/10 text-white"
                                                        }`}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <p className={`text-xs mt-1 ${isSender ? "text-purple-100" : "text-purple-200"}`}>
                                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-purple-200">No messages yet. Start the conversation!</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                        disabled={sending}
                                    />
                                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                                        {sending ? "Sending..." : "Send"}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Select a conversation
                                    </h3>
                                    <p className="text-purple-200">
                                        Choose a conversation from the list to start chatting
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function Messages() {
    return (
        <Suspense fallback={
            <div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Messages</h1>
                        <p className="text-purple-200 text-lg">
                            Loading...
                        </p>
                    </div>
                </div>
            </div>
        }>
            <MessagesContent />
        </Suspense>
    );
}
