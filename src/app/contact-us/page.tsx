//src/app/contact-us/page.tsx
export default function ContactUs() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#2d1b54] to-[#7a4b94] text-white">
            <main className="flex-1 pt-20 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
                <p className="text-lg">Reach out to us at <a href="mailto:support@skillsync.com" className="underline">support@skillsync.com</a>.</p>
            </main>
        </div>
    );
}