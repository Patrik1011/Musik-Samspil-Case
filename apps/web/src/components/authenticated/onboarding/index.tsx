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

interface FormData {
  phone_number: string;
  bio: string;
}

interface Errors {
  phone_number?: string;
  bio?: string;
  general?: string;
}

export const Onboarding = () => {
  const [formData, setFormData] = React.useState<FormData>({
    phone_number: "",
    bio: "",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isOnBoarded = useSelector((state: RootState) => state.auth.isOnBoarded);

  useEffect(() => {
    if (isAuthenticated && isOnBoarded) {
      navigate("/home");
    }
  }, [isAuthenticated, isOnBoarded, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData({ phone_number: "", bio: "" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      console.error("Error during onboarding:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <Headline title="Complete Your Profile" textColor="text-steel-blue" />
      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <Button type="submit" title="Complete Onboarding" />

        {errors.general && (
          <div className="text-red-500 text-sm text-center mt-2">{errors.general}</div>
        )}
      </form>
    </div>
  );
};
