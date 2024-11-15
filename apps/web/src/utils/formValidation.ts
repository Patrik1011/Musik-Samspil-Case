interface Errors {
  email?: string;
  password?: string;
  name?: string;
  lastName?: string;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  } else if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return undefined;
};

const validateName = (name: string): string | undefined => {
  if (!name) {
    return "Name is required";
  } else if (name.length < 2) {
    return "Name must be at least 2 characters";
  }
  return undefined;
};

const validateLastName = (lastName: string): string | undefined => {
  if (!lastName) {
    return "Last name is required";
  } else if (lastName.length < 2) {
    return "Last name must be at least 2 characters";
  }
  return undefined;
};

export const validateForm = (formData: {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
}): Errors => {
  const errors: Errors = {};

  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);
  const nameError = formData.name ? validateName(formData.name) : undefined;
  const lastNameError = formData.lastName
    ? validateLastName(formData.lastName)
    : undefined;

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (nameError) errors.name = nameError;
  if (lastNameError) errors.lastName = lastNameError;

  return errors;
};
