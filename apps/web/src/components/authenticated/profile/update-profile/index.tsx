import React, { useEffect, useState } from "react";
import { UserEntity } from "../../../../utils/types.ts";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../../services/UserService.ts";
import { Headline } from "../../../unauthenticated/auth/Headline.tsx";
import { InputField } from "../../../InputField.tsx";
import { TextArea } from "../../../TextArea.tsx";
import { Button } from "../../../Button.tsx";

export const UpdateProfile = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [formData, setFormData] = useState<Partial<UserEntity>>({});
  const [error, setError] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "city" || name === "country" || name === "address") {
      setFormData((prev) => ({
        ...prev,
        location: {
          city: prev.location?.city ?? "",
          country: prev.location?.country ?? "",
          address: prev.location?.address ?? "",
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
        location: {
          city: formData.location?.city?.trim() as string,
          country: formData.location?.country?.trim() as string,
          address: formData.location?.address?.trim() as string,
        },
      });

      setUser(updatedUser);
      setError("");
      setShowConfirmModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/");
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
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Headline title="Update Profile" className="mb-6" />
        <InputField
          id="first_name"
          type="text"
          name="first_name"
          value={formData.first_name || ""}
          placeholder={user.first_name || ""}
          label="First Name"
          onChange={handleInputChange}
          required
        />
        <InputField
          id="last_name"
          type="text"
          name="last_name"
          value={formData.last_name || ""}
          placeholder={user.last_name || ""}
          label="Last Name"
          onChange={handleInputChange}
          required
        />
        <InputField
          id="email"
          type="email"
          value={user.email}
          disabled
          label="Email"
          className="bg-light-gray"
        />
        <InputField
          id="phone_number"
          type="tel"
          name="phone_number"
          value={formData.phone_number || ""}
          placeholder={user.phone_number || ""}
          label="Phone Number"
          onChange={handleInputChange}
        />
        <InputField
          id="city"
          type="text"
          name="city"
          value={formData.location?.city || ""}
          placeholder={user.location?.city || "Enter your city"}
          label="City"
          onChange={handleInputChange}
        />
        <InputField
          id="country"
          type="text"
          name="country"
          value={formData.location?.country || ""}
          placeholder={user.location?.country || "Enter your country"}
          label="Country"
          onChange={handleInputChange}
        />
        <InputField
          id="address"
          type="text"
          name="address"
          value={formData.location?.address || ""}
          placeholder={user.location?.address || "Enter your address: e.g. 123 Main St"}
          label="Address"
          onChange={handleInputChange}
        />

        <TextArea
          name="bio"
          value={formData.bio || ""}
          onChange={handleInputChange}
          label="Bio"
          placeholder={user.bio || ""}
        />

        <Button title="Update Profile" type="submit" className="w-full bg-steel-blue text-white" />
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
