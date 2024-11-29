import React, { useEffect, useState } from "react";
import { UserEntity } from "../../../utils/types.ts";
import { userService } from "../../../services/UserService.ts";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [formData, setFormData] = useState<Partial<UserEntity>>({});
  const [error, setError] = useState<string>("");
  const [instruments, setInstruments] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

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

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
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
      setShowConfirmModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
      console.error(err);
      setShowConfirmModal(false);
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
            className="w-full p-2 border rounded text-medium-gray"
            required
            placeholder={user.first_name || ""}
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
            className="w-full p-2 border rounded text-medium-gray"
            required
            placeholder={user.last_name || ""}
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
            className="w-full p-2 border rounded bg-gray-100 text-medium-gray"
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
            className="w-full p-2 border rounded text-medium-gray"
            placeholder={user.phone_number || ""}
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
            className="w-full p-2 border rounded text-medium-gray"
            rows={4}
            placeholder={user.bio || ""}
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
            <option value="">{user.instrument || "Select an instrument"}</option>
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

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
            <p className="mb-6">Are you sure you want to save these changes to your profile?</p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-steel-blue text-white rounded hover:bg-opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p className="mb-6">Profile updated successfully!</p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="px-4 py-2 bg-steel-blue text-white rounded hover:bg-opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
