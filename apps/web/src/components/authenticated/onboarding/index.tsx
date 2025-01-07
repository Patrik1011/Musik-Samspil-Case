import { Headline } from "../../unauthenticated/auth/Headline.tsx";
import { InputField } from "../../InputField.tsx";
import { Button } from "../../Button.tsx";
import React, { useEffect } from "react";
import { TextArea } from "../../TextArea.tsx";
import { ValidateOnboardingForm } from "../../../utils/onboardingFormValidation.ts";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { completeOnboarding } from "../../../redux/authActions.ts";
import { Instrument } from "../../../enums/Instrument";

interface FormData {
  phone_number: string;
  bio: string;
  instruments: string[];
  location: {
    city: string;
    country: string;
    address: string;
  };
}

interface Errors {
  phone_number?: string;
  bio?: string;
  instruments?: string;
  city?: string;
  country?: string;
  address?: string;
  general?: string;
}

export const Onboarding = () => {
  const [formData, setFormData] = React.useState<FormData>({
    phone_number: "",
    bio: "",
    instruments: [],
    location: {
      city: "",
      country: "",
      address: "",
    },
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isOnBoarded = useSelector((state: RootState) => state.auth.isOnBoarded);

  useEffect(() => {
    if (isAuthenticated && isOnBoarded) {
      navigate("/");
    }
  }, [isAuthenticated, isOnBoarded, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!formData.instruments.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        instruments: [...prev.instruments, value],
      }));
    }
  };

  const removeInstrument = (instrument: string) => {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((i) => i !== instrument),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = ValidateOnboardingForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await dispatch(completeOnboarding(formData, navigate));
      setErrors({});
      setFormData({
        phone_number: "",
        bio: "",
        instruments: [],
        location: { city: "", country: "", address: "" },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      console.error("Error during onboarding:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Headline title="Complete Your Profile" className="mb-4" />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="phone_number"
          errorMessages={errors.phone_number}
          name="phone_number"
          placeholder="Phone Number"
          type="tel"
          label="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />

        <TextArea
          name="bio"
          placeholder="Tell us about yourself (optional)"
          label="Bio"
          value={formData.bio}
          errorMessages={errors.bio}
          onChange={handleChange}
        />

        <InputField
          id="city"
          name="city"
          label="City"
          placeholder="Enter your city"
          value={formData.location.city}
          onChange={handleLocationChange}
          errorMessages={errors.city}
        />

        <InputField
          id="country"
          name="country"
          label="Country"
          placeholder="Enter your country"
          value={formData.location.country}
          onChange={handleLocationChange}
          errorMessages={errors.country}
        />

        <InputField
          id="address"
          name="address"
          label="Address"
          placeholder="Enter your address"
          value={formData.location.address}
          onChange={handleLocationChange}
          errorMessages={errors.address}
        />

        <div className="space-y-2">
          <label htmlFor="instruments" className="block text-sm font-medium text-gray-700">
            Instruments
          </label>
          <select
            id="instruments"
            onChange={handleInstrumentChange}
            value=""
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-steel-blue"
          >
            <option value="" disabled>
              Add an instrument
            </option>
            {Object.values(Instrument).map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
          {errors.instruments && <p className="text-red-500 text-sm">{errors.instruments}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.instruments.map((instrument) => (
              <span
                key={instrument}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-steel-blue bg-opacity-10 text-steel-blue"
              >
                {instrument}
                <button
                  type="button"
                  onClick={() => removeInstrument(instrument)}
                  className="ml-2 text-steel-blue hover:text-steel-blue-dark"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <Button type="submit" title="Complete Onboarding" className="bg-steel-blue text-white" />

        {errors.general && (
          <div className="text-red-500 text-sm text-center mt-2">{errors.general}</div>
        )}
      </form>
    </div>
  );
};
