import React, { useState, ChangeEvent, FormEvent } from "react";
//import { useAuth } from "../../../context/AuthContext";
//import { registerService } from "../../../services/AuthService";
import { Button } from "./Button.tsx";
import { Headline } from "./Headline.tsx";
import { validateForm } from "../../../utils/formValidation.ts";
import { InputField } from "./InputField.tsx";

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
}

const Register: React.FC = () => {
  //const { authenticateUser } = useAuth();
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm(registerData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setRegisterData({ firstName: "", lastName: "", password: "", email: "" });
    console.log("Form submitted successfully");

    // calling register service
    // const result = await registerService(registerInfo);
    //
    // if (result) {
    //   authenticateUser(result);
    // } else {
    //   console.error("Registration failed");
    // }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Headline title="Sign Up" className="mb-6" />
      <div className="space-y-4">
        <InputField
          errorMessages={errors.firstName}
          name="firstName"
          type="text"
          placeholder="Firstname"
          label="Firstname"
          value={registerData.firstName}
          onChange={handleChange}
        />
        <InputField
          errorMessages={errors.lastName}
          name="lastName"
          type="text"
          placeholder="Lastname"
          label="Lastname"
          value={registerData.lastName}
          onChange={handleChange}
        />
        <InputField
          errorMessages={errors.email}
          name="email"
          type="email"
          placeholder="Email"
          label="Email"
          value={registerData.email}
          onChange={handleChange}
        />
        <InputField
          errorMessages={errors.password}
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          value={registerData.password}
          onChange={handleChange}
        />
        <Button type="submit" title="Sign up" />
      </div>
    </form>
  );
};

export default Register;
