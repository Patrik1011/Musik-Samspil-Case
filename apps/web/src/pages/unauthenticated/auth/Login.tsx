import type React from "react";
import Login from "../../../components/unauthenticated/auth/Login";
import { Layout } from "./Layout";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Layout>
        <Login />
      </Layout>
    </div>
  );
};

export default LoginPage;
