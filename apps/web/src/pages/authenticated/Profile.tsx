import React, { useEffect, useState } from "react";
import { UserEntity } from "../../utils/types";
import { userService } from "../../services/UserService";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserEntity>>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setFormData(userData);
    } catch (err) {
      setError("Failed to load user profile");
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="first_name" className="block text-sm font-medium">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded disabled:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded disabled:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone_number" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="phone_number"
            type="tel"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded disabled:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded disabled:bg-gray-100"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="instrument" className="block text-sm font-medium">
            Instrument
          </label>
          <input
            id="instrument"
            type="text"
            name="instrument"
            value={formData.instrument || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded disabled:bg-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                }}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
