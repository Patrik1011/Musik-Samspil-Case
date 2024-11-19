interface Errors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return undefined;
};

const validateFirstName = (name: string): string | undefined => {
  if (!name) {
    return "Name is required";
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters";
  }
  return undefined;
};

const validateLastName = (lastName: string): string | undefined => {
  if (!lastName) {
    return "Last name is required";
  }
  if (lastName.length < 2) {
    return "Last name must be at least 2 characters";
  }
  return undefined;
};

export const validateForm = (formData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Errors => {
  const errors: Errors = {};

  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);

  if (formData.firstName !== undefined) {
    const firstNameError = validateFirstName(formData.firstName);
    if (firstNameError) errors.firstName = firstNameError;
  }

  if (formData.lastName !== undefined) {
    const lastNameError = validateLastName(formData.lastName);
    if (lastNameError) errors.lastName = lastNameError;
  }

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
};
