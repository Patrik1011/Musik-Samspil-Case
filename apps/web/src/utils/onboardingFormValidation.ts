interface Errors {
  phone_number?: string;
  bio?: string;
}

const ErrorMessages = {
  PHONE_NUMBER_REQUIRED: "Phone number is required",
  PHONE_NUMBER_LENGTH: "Phone number must be at least 8 characters",
  BIO_LENGTH: "Bio must be at least 10 characters",
};

const ValidatePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return ErrorMessages.PHONE_NUMBER_REQUIRED;
  }
  if (phoneNumber.length < 8) {
    return ErrorMessages.PHONE_NUMBER_LENGTH;
  }
  return undefined;
};

const ValidateBio = (bio: string) => {
  if (bio.length >= 1 && bio.length < 10) {
    return ErrorMessages.BIO_LENGTH;
  }
  return undefined;
};

export const ValidateOnboardingForm = (formData: {
  phone_number: string;
  bio: string;
}): Errors => {
  const errors: Errors = {};

  const phoneNumberError = ValidatePhoneNumber(formData.phone_number);
  const bioError = ValidateBio(formData.bio);

  if (phoneNumberError) errors.phone_number = phoneNumberError;
  if (bioError) errors.bio = bioError;

  return errors;
};
