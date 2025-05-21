//src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        axios
            .get("/api/auth/verify")
            .then((res) => {
                if (res.data.success) {
                    setUser({ name: res.data.user.name });
                } else {
                    router.push("/login");
                }
            })
            .catch(() => router.push("/login"));
    }, [router]);

    if (!user) return null;

    function openTab(e: MouseEvent<HTMLButtonElement>, tabName: string): void {
        // Hide all tab contents
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            (tabContents[i] as HTMLElement).style.display = 'none';
        }

        // Remove active class from all buttons
        const tabButtons = document.getElementsByClassName('tab-btn');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }

        // Show the selected tab content and mark button as active
        document.getElementById(tabName)!.style.display = 'block';
        e.currentTarget.classList.add('active');
    }

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <br />
            <br />

            <div className="main-content">
                <div className="featured-section">
                    <h2>🔥 Featured Topics</h2>
                    <div className="featured-cards">
                        <div className="card">Web Development</div>
                        <div className="card">Machine Learning</div>
                        <div className="card">Competitive Programming</div>
                        <div className="card">Cyber Security</div>
                    </div>
                </div>

                <div className="tab-section">
                    <div className="tabs">
                        <button className="tab-btn active" onClick={(e) => openTab(e, 'connections')}>👥 Recommended Connections</button>
                        <button className="tab-btn" onClick={(e) => openTab(e, 'events')}>🎤 Upcoming Events & Webinars</button>
                    </div>
                    <div className="tab-content" id="connections">
                        <p>📌 Connect with students who share similar interests & exam goals.</p>
                        <ul>
                            <li>Vaibhav Soni - AI & ML learner</li>
                            <li>Vaishnavi Kanera - Data Science learner</li>
                            <li>Pranshu Bhatt - GATE CS aspirant</li>
                        </ul>
                    </div>
                    <div className="tab-content" id="events" style={{ display: 'none' }}>
                        <p>📌 Stay updated with upcoming tech events & webinars.</p>
                        <ul>
                            <li>🔹 AI & ML Trends - March 15, 2025 (Online Webinar)</li>
                            <li>🔹 Web Development Bootcamp - April 5, 2025 (College Seminar)</li>
                            <li>🔹 Cyber Security Conference - April 20, 2025 (Online Webinar)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
