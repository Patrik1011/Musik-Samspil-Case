import React, { useState, ChangeEvent, FormEvent } from "react";
import { InputField } from "../../InputField.tsx";
import { validateForm } from "../../../utils/formValidation";
import { Headline } from "./Headline";
import { Button } from "../../Button.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store.ts";
import { loginUser } from "../../../redux/authActions.ts";
import { useNavigate } from "react-router-dom";
import { CustomError } from "../../../utils/api.ts";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await dispatch(loginUser(formData));
      setErrors({});
      setFormData({ email: "", password: "" });
      navigate("/onboarding");
    } catch (error: unknown) {
      const err = error as CustomError;
      setErrors({ general: err.message });
    }
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      <Headline title="Sign In" className="mb-6" />
      <div className="space-y-4">
        <InputField
          id="email"
          errorMessages={errors.email}
          name="email"
          placeholder="Email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          errorMessages={errors.password}
        />
        <Button type="submit" title="Sign in" className="bg-steel-blue text-white w-full" />
        {errors.general && <div className="text-red-500 text-sm text-center">{errors.general}</div>}
      </div>
    </form>
  );
};

export default Login;
