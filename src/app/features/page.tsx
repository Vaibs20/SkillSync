//src/app/features/page.tsx
export default function Features() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#2d1b54] to-[#7a4b94] text-white">
            <main className="flex-1 pt-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">Features</h1>
                <ul className="list-none space-y-4">
                    <li className="flex items-center">
                        <i className="fas fa-check mr-2 text-[#00aaff]"></i>Connect with peers
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-check mr-2 text-[#00aaff]"></i>Join study groups
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-check mr-2 text-[#00aaff]"></i>Share skills
                    </li>
                </ul>
            </main>
        </div>
    );
}