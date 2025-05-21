// src/components/Footer.tsx
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-r from-[#2d1b54] to-[#7a4b94] text-white py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p>&copy; 2025 Skill Sync. All rights reserved.</p>
                </div>
                <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <Link href="/about" className="text-white hover:text-green-500 transition">
                        About
                    </Link>
                    <Link href="/features" className="text-white hover:text-green-500 transition">
                        Features
                    </Link>
                    <Link href="/contact-us" className="text-white hover:text-green-500 transition">
                        Contact Us
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;