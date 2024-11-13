import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react"
import { useAuth } from "../../../context/AuthContext";
import { loginService } from "../../../services/AuthService";

interface LoginInfo {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { authenticateUser } = useAuth();
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    username: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");

  console.log("We are in the Login component");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });

    if (name === "password" && value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginInfo.password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    const result = await loginService(loginInfo);
    if (result) {
      authenticateUser(result);
      console.log("Login successful:", result);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={loginInfo.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginInfo.password}
        onChange={handleChange}
        required
      />
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
