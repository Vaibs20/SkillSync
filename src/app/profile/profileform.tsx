// src / app / profile / profileform.tsx
import React from 'react';

interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  skills: string;
  setSkills: (skills: string) => void;
  isEditing: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ name, setName, bio, setBio, skills, setSkills, isEditing }) => {
  return (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-gray-600 font-medium">Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Bio</label>
        <textarea
          className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Skills</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default ProfileForm;
