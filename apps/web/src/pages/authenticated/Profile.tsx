import React, { useEffect, useState } from "react";
import { UserEntity } from "../../utils/types";
import { userService } from "../../services/UserService";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [formData, setFormData] = useState<Partial<UserEntity>>({});
  const [error, setError] = useState<string>("");
  const [instruments, setInstruments] = useState<string[]>([]);

  useEffect(() => {
    fetchUser();
    fetchInstruments();
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

  const fetchInstruments = async () => {
    try {
      const instrumentsList = await userService.getInstruments();
      setInstruments(instrumentsList);
    } catch (err) {
      console.error("Failed to load instruments", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
      setError("First name and last name are required");
      return;
    }

    try {
      const updatedUser = await userService.updateProfile({
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        phone_number: formData.phone_number?.trim(),
        bio: formData.bio?.trim(),
        instrument: formData.instrument?.trim(),
      });

      setUser(updatedUser);
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
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
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="instrument" className="block text-sm font-medium">
            Instrument
          </label>
          <select
            id="instrument"
            name="instrument"
            value={formData.instrument || ""}
            onChange={handleInputChange}
            className="w-full p-2 mt-1 text-base text-medium-gray border border-soft-gray rounded-xl outline-none"
          >
            <option value="">Select an instrument</option>
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="w-full lg:mx-0 text-base font-bold bg-steel-blue text-white mt-2 py-4 px-8 rounded-[10px] shadow-custom focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-200 ease-in-out"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
