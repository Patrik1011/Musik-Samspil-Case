import { Headline } from "../unauthenticated/auth/Headline.tsx";
import { InputField } from "../InputField.tsx";
import { Button } from "../Button.tsx";
import React from "react";
import { Select } from "../Select.tsx";
import { Instrument } from "../../enums/Instrument.ts";
import { TextArea } from "../TextArea.tsx";
import { ValidateOnboardingForm } from "../../utils/onboardingFormValidation.ts";

interface FormData {
  phoneNumber: string;
  bio: string;
  instrument: string;
}

interface Errors {
  phoneNumber?: string;
  bio?: string;
  instrument?: string;
  general?: string;
}

export const Onboarding = () => {
  const [formData, setFormData] = React.useState<FormData>({
    phoneNumber: "",
    bio: "",
    instrument: "",
  });
  const [errors, setErrors] = React.useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = ValidateOnboardingForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log(formData);
  };
  return (
    <div>
      <form className="" onSubmit={handleSubmit}>
        <Headline title="Onboarding process" className="mb-6" />
        <div className="space-y-4">
          <InputField
            id="phoneNumber"
            errorMessages={errors.phoneNumber}
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            label="Phone Number"
            value={formData.phoneNumber}
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
