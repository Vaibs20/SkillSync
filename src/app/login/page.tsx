// src / app / login / page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    console.log("User state:", user);
    console.log("Button disabled state:", buttonDisabled);
    console.log("Loading state:", loading);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful");

            // Check isOnboarded from token
            const token = response.headers["set-cookie"]?.find((c) => c.includes("token"))?.split(";")[0].split("=")[1];
            if (token) {
                const decoded = await import("jsonwebtoken").then(({ verify }) =>
                    verify(token, process.env.JWT_SECRET_KEY!) as { isOnboarded: boolean }
                );
                router.push(decoded.isOnboarded ? "/dashboard" : "/onboarding");
            } else {
                router.push("/onboarding");
            }
        } catch (error: any) {
            console.log("Error during login:", error.message);
            toast.error(error.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-lg p-10 shadow-md rounded-lg bg-white/30 backdrop-blur-lg">
                <h2 className="mb-6 text-4xl font-bold text-center text-black">
                    {loading ? "Processing" : "Login"}
                </h2>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-black">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={user.email}
                        placeholder="Enter your email"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-black">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={user.password}
                        placeholder="Enter your password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required
                    />
                </div>
                <button
                    className="w-full py-3 mt-4 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                    onClick={handleLogin}
                    disabled={buttonDisabled || loading}
                >
                    Login
                </button>
                <p className="mt-4 text-sm text-center">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-green-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}