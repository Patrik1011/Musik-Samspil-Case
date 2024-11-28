import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../Button.tsx";
import { Headline } from "./Headline.tsx";
import { validateForm } from "../../../utils/formValidation.ts";
import { InputField } from "../../InputField.tsx";
import { authService } from "../../../services/AuthService.ts";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  first_name: string;
  last_name: string;
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
    first_name: "",
    last_name: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
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
        setErrors({});
        setRegisterData({
          first_name: "",
          last_name: "",
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
        <InputField
          id="first_name"
          errorMessages={errors.firstName}
          name="first_name"
          type="text"
          placeholder="Firstname"
          label="Firstname"
          value={registerData.first_name}
          onChange={handleChange}
        />
        <InputField
          id="last_name"
          errorMessages={errors.lastName}
          name="last_name"
          type="text"
          placeholder="Lastname"
          label="Lastname"
          value={registerData.last_name}
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
        <Button type="submit" title="Sign up" className="bg-steel-blue text-white w-full" />
        {errors.general && <div className="text-red-500 text-sm text-center">{errors.general}</div>}
      </div>
    </form>
  );
};

export default Register;
