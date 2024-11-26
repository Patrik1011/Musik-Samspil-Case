interface Errors {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errorMessages = {
  EMAIL_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_LENGTH: "Password must be at least 8 characters",
  NAME_REQUIRED: "Name is required",
  NAME_LENGTH: "Name must be at least 2 characters",
};

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return errorMessages.EMAIL_REQUIRED;
  }
  if (!EMAIL_REGEX.test(email)) {
    return errorMessages.INVALID_EMAIL;
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return errorMessages.PASSWORD_REQUIRED;
  }
  if (password.length < 8) {
    return errorMessages.PASSWORD_LENGTH;
  }
  return undefined;
};

const validateFirstName = (name: string): string | undefined => {
  if (!name) {
    return errorMessages.NAME_REQUIRED;
  }
  if (name.length < 2) {
    return errorMessages.NAME_LENGTH;
  }
  return undefined;
};

const validateLastName = (lastName: string): string | undefined => {
  if (!lastName) {
    return errorMessages.NAME_REQUIRED;
  }
  if (lastName.length < 2) {
    return errorMessages.NAME_LENGTH;
  }
  return undefined;
};

export const validateForm = (formData: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Errors => {
  const errors: Errors = {};

  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);

  if (formData.first_name !== undefined) {
    const firstNameError = validateFirstName(formData.first_name);
    if (firstNameError) errors.first_name = firstNameError;
  }

  if (formData.last_name !== undefined) {
    const lastNameError = validateLastName(formData.last_name);
    if (lastNameError) errors.last_name = lastNameError;
  }

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
};
