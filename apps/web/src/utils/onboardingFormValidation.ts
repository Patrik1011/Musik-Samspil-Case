import { Instrument } from "../enums/Instrument.ts";

interface Errors {
  phoneNumber?: string;
  bio?: string;
  instrument?: string;
}

const ValidatePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return "Phone number is required";
  }
  if (phoneNumber.length < 10) {
    return "Phone number must be at least 10 characters";
  }
  return undefined;
};

const ValidateBio = (bio: string) => {
  if (bio.length >= 1) {
    if (bio.length < 10) {
      return "Bio must be at least 10 characters";
    }
  }
};

const ValidateInstrument = (instrument: string) => {
  if (!instrument || instrument === "") {
    return "Instrument is required";
  }
  if (!Object.values(Instrument).includes(instrument)) {
    return "Invalid instrument";
  }
  return undefined;
};

export const ValidateOnboardingForm = (formData: {
  phoneNumber: string;
  bio: string;
  instrument: string;
}): Errors => {
  const errors: Errors = {};

  const phoneNumberError = ValidatePhoneNumber(formData.phoneNumber);
  const bioError = ValidateBio(formData.bio);
  const instrumentError = ValidateInstrument(formData.instrument);

  if (phoneNumberError) {
    errors.phoneNumber = phoneNumberError;
  }
  if (bioError) {
    errors.bio = bioError;
  }
  if (instrumentError) {
    errors.instrument = instrumentError;
  }

  return errors;
};
