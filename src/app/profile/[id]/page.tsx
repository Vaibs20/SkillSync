// src / app / profile / [id] / page.tsx
"use client";

import { useState, useEffect } from "react";
import ProfileForm from "../profileform";
import ProfileImage from "../profileimage";
import axios from "axios";

const Profile = ({ params }: { params: { id: string } }) => {
    const [isEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`/api/users/${params.id}`).then((res) => {
            setName(res.data.name);
            setBio(res.data.learning_goal || "");
            setSkills(res.data.known_skills.join(", "));
        });
    }, [params.id]);

    return (
        <div className="flex min-h-screen p-4">
            <div className="bg-[#a0a7c7] p-12 rounded-2xl shadow-lg w-[400px] h-[500px] text-center ml-10 absolute left-10 top-22">
                <ProfileImage image={profileImage} setImage={setProfileImage} isEditing={isEditing} />
                <ProfileForm
                    name={name}
                    setName={setName}
                    bio={bio}
                    setBio={setBio}
                    skills={skills}
                    setSkills={setSkills}
                    isEditing={isEditing}
                />
            </div>
        </div>
    );
};

export default Profile;