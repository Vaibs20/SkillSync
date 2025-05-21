// src / app / signup / page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleSignup = async () => {
        try {
            setLoading(true);
            const signupResponse = await axios.post("/api/users/signup", user);
            console.log("Signup response:", signupResponse.data);

            // Automatically log in
            const loginResponse = await axios.post("/api/users/login", {
                email: user.email,
                password: user.password,
            });
            console.log("Login response:", loginResponse.data);

            toast.success("Signup and login successful");
            router.push("/onboarding");
        } catch (err: any) {
            console.error("Error:", err.response?.data || err);
            toast.error(err.response?.data?.error || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.name.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center text-black">
            <div className="w-full max-w-lg p-10 shadow-md rounded-lg bg-white/30 backdrop-blur-lg">
                <h2 className="mb-6 text-2xl font-bold">{loading ? "Processing" : "Signup"}</h2>
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required
                    />
                </div>
                <button
                    className="w-full py-2 mt-4 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={handleSignup}
                    disabled={buttonDisabled || loading}
                >
                    {buttonDisabled ? "Please fill all fields" : loading ? "Signing Up..." : "Sign Up"}
                </button>
                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-green-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}