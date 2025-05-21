//src/components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("/api/auth/verify")
            .then((res) => {
                if (res.data.success) {
                    setIsLoggedIn(true);
                    setUser({ id: res.data.user.id, name: res.data.user.name });
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            toast.success("Logged out successfully");
            setIsLoggedIn(false);
            setUser(null);
            setIsSidebarOpen(false);
            router.push("/login");
        } catch (error) {
            toast.error("Error logging out");
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-l from-[#2d1b54] to-[#7a4b94] shadow-md min-h-[80px]">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.png" alt="Skill Sync Logo" width={300} height={300} />
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Dashboard
                            </Link>
                            <Link href="/search" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Search
                            </Link>
                            <Link href="/contacts" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Contacts
                            </Link>
                            <Link href="/study" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Study
                            </Link>
                            <Link href="/profile">
                                <Image
                                    src="/placeholder-avatar.png"
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full hover:ring-2 hover:ring-indigo-600 transition"
                                />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Homepage
                            </Link>
                            <Link href="/about" className="text-white font-bold text-lg hover:text-green-500 transition">
                                About
                            </Link>
                            <Link href="/features" className="text-white font-bold text-lg hover:text-green-500 transition">
                                Features
                            </Link>
                            <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                                Login
                            </Link>
                            <Link href="/signup" className="bg-[#ff914d] text-white px-4 py-2 rounded-lg hover:bg-[#ff8133] transition">
                                Signup
                            </Link>
                        </>
                    )}
                </nav>

                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
                    <div className="w-64 bg-gradient-to-l from-[#2d1b54] to-[#7a4b94] h-full p-6 flex flex-col">
                        <button
                            className="self-end text-white mb-4"
                            onClick={toggleSidebar}
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <nav className="flex flex-col space-y-4">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/search"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Search
                                    </Link>
                                    <Link
                                        href="/contacts"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Contacts
                                    </Link>
                                    <Link
                                        href="/study"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Study
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-2"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <Image
                                            src="/placeholder-avatar.png"
                                            alt="Profile"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className="text-white font-bold text-lg hover:text-green-500 transition">
                                            Profile
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Homepage
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="/features"
                                        className="text-white font-bold text-lg hover:text-green-500 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Features
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="bg-[#ff914d] text-white px-4 py-2 rounded-lg hover:bg-[#ff8133] transition"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;