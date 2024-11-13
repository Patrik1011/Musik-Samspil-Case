import type React from "react";
import Login from "../../../components/unauthenticated/auth/Login";

const LoginPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-amber-400">Login Page</h1>
      <Login />
    </div>
  );
};

export default LoginPage;
