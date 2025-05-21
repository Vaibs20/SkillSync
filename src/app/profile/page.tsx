// src / app / profile / page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "./profileform";
import ProfileImage from "./profileimage";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [branch, setBranch] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/auth/verify").then((res) => {
      if (res.data.success) {
        setUserId(res.data.user.id);
        axios.get(`/api/users/${res.data.user.id}`).then((userRes) => {
          setName(userRes.data.name);
          setBio(userRes.data.learning_goal || "");
          setSkills(userRes.data.known_skills.join(", "));
          setBranch(userRes.data.branch || "");
        });
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/users/${userId}`, {
        name,
        learning_goal: bio,
        known_skills: skills.split(",").map((s) => s.trim()),
        branch,
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Error updating profile");
    }
  };

  if (!userId) return null;

  return (
    <div className="flex-1 p-4">
      <div className="bg-[#a0a7c7] p-12 rounded-2xl shadow-lg w-[400px] h-[500px] text-center ml-10">
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
        <button
          className="mt-6 w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;