import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuth } from "../../../context/AuthContext";
import { registerService } from "../../../services/AuthService";

// Define the type for registration information
interface RegisterInfo {
  username: string;
  password: string;
  email: string;
}

const Register: React.FC = () => {
  const { authenticateUser } = useAuth();
  const [registerInfo, setRegisterInfo] = useState<RegisterInfo>({ username: "", password: "", email: "" });
  const [passwordError, setPasswordError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterInfo({ ...registerInfo, [name]: value });

    if (name === "password" && value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerInfo.password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    // calling register service
    const result = await registerService(registerInfo); 

    if (result) {
      authenticateUser(result);
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={registerInfo.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={registerInfo.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={registerInfo.password}
        onChange={handleChange}
        required
      />
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
