//src/app/onboarding/formData.tsx
const formData = [
    // { question: "What is your full name?", type: "text" },
    { question: "Which department are you in?", type: "select", options: ["Computer Science", "Electrical", "Mechanical", "Civil"] },
    { question: "What is your graduation year?", type: "select", options: ["2025", "2026", "2027", "2028"] },
    { question: "List your current skills:", type: "multiSelect", options: ["C/C++", "Java", "Python", "DSA (Data Structures and Algorithm) or Competitive Programming", "OOPS", "Frontend Web Development", "Backend Web Development (MERN/MEAN)", "Backend Web Development (Python)", "Application Development (Flutter)", "Application Development (React Native)", "Artificial Intelligence and Machine Learning", "Blockchain", "DevOps", "Cloud Computing", "Cyber Security", "MySQL/NoSQL", "Graphic Designing"] },
    { question: "What is your prefered career path ?:", type: "multiSelect", options: ["AI & Machine Learning", "Data Science & Analytics", "Full Stack Web Development", "Frontend Web Development", "Backend Web Development", "Mobile App Development (Android/iOS)", "Cloud Computing", "Cyber Security", "Game Development"] },
    { question: "Have you worked on any projects?", type: "select", options: ["Yes", "No"] },
    { question: "What are your 3-month goals?", type: "text" },
    { question: "How much time are you available for? (per week)", type: "select", options: ["7-8", "8-9", "9-10", "10-11", "11-12"] }
];

export default formData;

