"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import formData from "../onboarding/formData";

export default function Search() {
    const [searchCriteria, setSearchCriteria] = useState({
        name: "",
        email: "",
        branch: "",
        passing_year: "",
        known_skills: [] as string[],
        career_path: [] as string[],
        experience: "",
        learning_goal: "",
        availability: "",
        isOnboarded: "",
        isVerified: "",
    });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(searchCriteria).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(key, v));
                } else if (value) {
                    params.append(key, value);
                }
            });

            const res = await axios.get(`/api/users/search?${params.toString()}`);
            setResults(res.data.users);
            toast.success("Search completed!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (key: 'known_skills' | 'career_path', value: string) => {
        setSearchCriteria((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((v: string) => v !== value)
                : [...prev[key], value],
        }));
    };

    // Reuse options from onboarding form
    const departments = formData.find((f) => f.question.includes("department"))?.options || [];
    const years = formData.find((f) => f.question.includes("graduation year"))?.options || [];
    const skills = formData.find((f) => f.question.includes("skills"))?.options || [];
    const careerPaths = formData.find((f) => f.question.includes("career path"))?.options || [];
    const availabilityOptions = formData.find((f) => f.question.includes("available"))?.options || [];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#2d1b54] to-[#7a4b94] text-white">
            <main className="flex-1 pt-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">Search Users</h1>
                <div className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.name}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })}
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.email}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Department</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.branch}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, branch: e.target.value })}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Graduation Year</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.passing_year}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, passing_year: e.target.value })}
                            >
                                <option value="">Select year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Skills</label>
                            <div className="max-h-32 overflow-y-auto border p-2 rounded-lg">
                                {skills.map((skill) => (
                                    <label key={skill} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            checked={searchCriteria.known_skills.includes(skill)}
                                            onChange={() => handleCheckboxChange("known_skills", skill)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>{skill}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Career Path</label>
                            <div className="max-h-32 overflow-y-auto border p-2 rounded-lg">
                                {careerPaths.map((path) => (
                                    <label key={path} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={path}
                                            checked={searchCriteria.career_path.includes(path)}
                                            onChange={() => handleCheckboxChange("career_path", path)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>{path}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Experience</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 MAINTAINED focus:ring-indigo-500"
                                value={searchCriteria.experience}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, experience: e.target.value })}
                            >
                                <option value="">Select experience</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Learning Goal</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.learning_goal}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, learning_goal: e.target.value })}
                                placeholder="Enter goal"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Availability</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.availability}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, availability: e.target.value })}
                            >
                                <option value="">Select availability</option>
                                {availabilityOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Onboarded</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.isOnboarded}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, isOnboarded: e.target.value })}
                            >
                                <option value="">Select status</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Verified</label>
                            <select
                                className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                value={searchCriteria.isVerified}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, isVerified: e.target.value })}
                            >
                                <option value="">Select status</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="w-full py-3 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>
                {results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((user) => (
                            <Link
                                key={user._id}
                                href={`/profile/${user._id}`}
                                className="bg-white/30 backdrop-blur-lg p-4 rounded-lg shadow-md hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-semibold">{user.name}</h3>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Department:</strong> {user.branch || "N/A"}</p>
                                <p><strong>Skills:</strong> {user.known_skills.join(", ") || "None"}</p>
                                <p><strong>Career Path:</strong> {user.career_path.join(", ") || "None"}</p>
                            </Link>
                        ))}
                    </div>
                )}
                {results.length === 0 && !loading && (
                    <p className="text-center text-lg">No users found matching your criteria.</p>
                )}
            </main>
        </div>
    );
}