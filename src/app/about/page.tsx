// src/app/about/page.tsx
export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#2d1b54] to-[#7a4b94] text-white">
            <main className="flex-1 pt-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">About Skill Sync</h1>
                <p className="text-lg">
                    Skill Sync is a platform to connect students, professionals, and learners to share knowledge, collaborate on
                    projects, and grow their networks.
                </p>
            </main>
        </div>
    );
}