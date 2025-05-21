//src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="flex flex-row justify-between items-start px-20 py-16 min-h-screen">
        {/* Left side - Hero content */}
        <div className="hero-content w-1/2">
          <h1>Connect, Collaborate, and Learn</h1>
          <p className="hero-desc">
            Skill Sync is a networking platform that helps students find study partners,
            form groups, and participate in collaborative learning experiences.
          </p>
          <ul className="hero-list">
            <li><i className="fas fa-check-circle"></i> Find students with similar interests</li>
            <li><i className="fas fa-check-circle"></i> Join or create study groups</li>
            <li><i className="fas fa-check-circle"></i> Stay updated with upcoming events & webinars</li>
          </ul>
          <a href="/auth/signup" className="cta-btn">Get Started</a>
        </div>

        {/* Right side - Images and Features */}
        <div className="w-1/2 flex flex-col gap-8">
          {/* Images Section */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="image-container">
              <img src="avatars.png" alt="Illustration 1" className="w-32 h-32 transition-transform duration-500 ease-out hover:scale-110" />
              <p className="image-text">Find Study Partners</p>
            </div>
            <div className="image-container">
              <img src="dev-productivity.png" alt="Illustration 2" className="w-32 h-32 transition-transform duration-500 ease-out hover:scale-110" />
              <p className="image-text">Boost Productivity</p>
            </div>
            <div className="image-container">
              <img src="pair-programming.png" alt="Illustration 3" className="w-32 h-32 transition-transform duration-500 ease-out hover:scale-110" />
              <p className="image-text">Collaborate & Learn</p>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="feature">
              <i className="fas fa-users"></i>
              <h3>Networking</h3>
              <p>Connect with students preparing for the same exams or subjects.</p>
            </div>
            <div className="feature">
              <i className="fas fa-comments"></i>
              <h3>Study Groups</h3>
              <p>Join discussions, share resources, and prepare together.</p>
            </div>
            <div className="feature">
              <i className="fas fa-calendar-alt"></i>
              <h3>Webinars & Events</h3>
              <p>Stay informed about upcoming educational events.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}