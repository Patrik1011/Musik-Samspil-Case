import { Headline } from "../unauthenticated/auth/Headline.tsx";
import { InputField } from "../InputField.tsx";
import { Button } from "../Button.tsx";
import React, { useEffect } from "react";
import { Select } from "../Select.tsx";
import { Instrument } from "../../enums/Instrument.ts";
import { TextArea } from "../TextArea.tsx";
import { ValidateOnboardingForm } from "../../utils/onboardingFormValidation.ts";
//import { onboardingService } from "../../services/OnboardingService.ts";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { completeOnboarding } from "../../redux/authActions.ts";

interface FormData {
  phone_number: string;
  bio: string;
  instrument: string;
}

interface Errors {
  phone_number?: string;
  bio?: string;
  instrument?: string;
  general?: string;
}

export const Onboarding = () => {
  const [formData, setFormData] = React.useState<FormData>({
    phone_number: "",
    bio: "",
    instrument: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setFormData({ phone_number: "", bio: "", instrument: "" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrors({ general: errorMessage });
      console.error("Error during onboarding:", error);
    }
  };

  return (
    <div>
      <form className="" onSubmit={handleSubmit}>
        <Headline title="Onboarding process" className="mb-6" />
        <div className="space-y-4">
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
          <Select
            onChange={(e) => {
              setFormData({ ...formData, instrument: e.target.value });
            }}
            options={Object.values(Instrument).map((instrument) => instrument.toString())}
            label="Select an instrument"
            errorMessages={errors.instrument}
          />
          <TextArea
            name="bio"
            placeholder="Tell us about yourself (optional)"
            label="Bio"
            value={formData.bio}
            errorMessages={errors.bio}
            onChange={(e) => {
              setFormData({ ...formData, bio: e.target.value });
            }}
          />

          <Button type="submit" title="Complete Onboarding" />
          {errors.general && (
            <div className="text-red-500 text-sm text-center">{errors.general}</div>
          )}
        </div>
      </form>
    </div>
  );
};
