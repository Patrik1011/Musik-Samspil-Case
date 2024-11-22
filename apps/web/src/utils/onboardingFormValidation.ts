import { Instrument } from "../enums/Instrument.ts";

interface Errors {
  phone_number?: string;
  bio?: string;
  instrument?: string;
}

const ValidatePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return "Phone number is required";
  }
  if (phoneNumber.length < 8) {
    return "Phone number must be at least 8 characters";
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
  phone_number: string;
  bio: string;
  instrument: string;
}): Errors => {
  const errors: Errors = {};

  const phoneNumberError = ValidatePhoneNumber(formData.phone_number);
  const bioError = ValidateBio(formData.bio);
  const instrumentError = ValidateInstrument(formData.instrument);

  if (phoneNumberError) {
    errors.phone_number = phoneNumberError;
  }
  if (bioError) {
    errors.bio = bioError;
  }
  if (instrumentError) {
    errors.instrument = instrumentError;
  }

  return errors;
};
