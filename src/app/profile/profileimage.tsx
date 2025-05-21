// src / app / profile / profileimage.tsx
import React from 'react';
// import { CameraIcon } from '@heroicons/react/24/solid';


interface ProfileImageProps {
  image: string | null;
  setImage: (image: string | null) => void;
  isEditing: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ image, setImage, isEditing }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <img
        src={image || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-4 border-gray-300"
      />
      {isEditing && (
        <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-md">
          {/* <CameraIcon className="w-5 h-5 text-gray-600" /> */}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      )}
    </div>
  );
};

export default ProfileImage;
