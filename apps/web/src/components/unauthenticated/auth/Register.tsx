import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../Button.tsx";
import { Headline } from "./Headline.tsx";
import { validateForm } from "../../../utils/formValidation.ts";
import { InputField } from "../../InputField.tsx";
import { authService } from "../../../services/AuthService.ts";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

interface Errors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

const Register: React.FC = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [registerMessage, setRegisterMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm(registerData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const result = await authService.register(registerData);

      if (result) {
        console.log("Registration successful");
        setRegisterMessage("Registration successful");
        setErrors({});
        setRegisterData({
          firstName: "",
          lastName: "",
          password: "",
          email: "",
        });
        navigate("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error: unknown) {
      const err = error as { response: { status: number } };
      if (err.response.status === 409) {
        setErrors({ general: "Email already exists" });
      } else {
        setErrors({ general: "An unexpected error occurred" });
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Headline title="Sign Up" className="mb-6" />
      <div className="space-y-4">
        {registerMessage && <p className="text-green-400 text-[14px]">{registerMessage}</p>}
        <InputField
          id="firstName"
          errorMessages={errors.firstName}
          name="firstName"
          type="text"
          placeholder="Firstname"
          label="Firstname"
          value={registerData.firstName}
          onChange={handleChange}
        />
        <InputField
          id="lastName"
          errorMessages={errors.lastName}
          name="lastName"
          type="text"
          placeholder="Lastname"
          label="Lastname"
          value={registerData.lastName}
          onChange={handleChange}
        />
        <InputField
          id="email"
          errorMessages={errors.email}
          name="email"
          type="email"
          placeholder="Email"
          label="Email"
          value={registerData.email}
          onChange={handleChange}
        />
        <InputField
          id="password"
          errorMessages={errors.password}
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          value={registerData.password}
          onChange={handleChange}
        />
        <Button type="submit" title="Sign up" />
        {errors.general && <div className="text-red-500 text-sm text-center">{errors.general}</div>}
      </div>
    </form>
  );
};

export default Register;
