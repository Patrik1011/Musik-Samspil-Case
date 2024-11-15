import React, { useState, ChangeEvent, FormEvent } from "react";
//import { useAuth } from "../../../context/AuthContext";
//import { loginService } from "../../../services/AuthService";
import { InputField } from "./InputField";
import { validateForm } from "../../../utils/formValidation";
import { Headline } from "./Headline";
import { Button } from "./Button";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  //const { authenticateUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setFormData({ email: "", password: "" });
    console.log("Form submitted successfully");

    // const result = await loginService(loginInfo);
    // if (result) {
    //   authenticateUser(result);
    //   console.log("Login successful:", result);
    // }
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      <Headline title="Sign In" className="mb-6" />
      <div className="space-y-4">
        <InputField
          errorMessages={errors.email}
          name="email"
          placeholder="Email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          errorMessages={errors.password}
        />
        <Button type="submit" title="Sign in" />
      </div>
    </form>
  );
};

export default Login;
