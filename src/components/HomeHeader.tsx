//src/components/HomeHeader.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const HomeHeader = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-l from-[#2d1b54] to-[#7a4b94] shadow-md min-h-[80px]">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="logo flex items-center">
                    <Image src="/logo.png" alt="Skill Sync Logo" width={300} height={300} />
                </Link>

                {/* Search Bar */}
                <div className="search-container hidden md:flex">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search communities..." />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
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
                </nav>

                {/* Mobile Hamburger Menu */}
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

            {/* Mobile Sidebar */}
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
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default HomeHeader;