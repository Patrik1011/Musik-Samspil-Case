import React from "react";
import Register from "../../../components/unauthenticated/auth/Register";
import { Layout } from "./Layout";

const RegisterPage: React.FC = () => {
  return (
    <div>
      <Layout>
        <Register />
      </Layout>
    </div>
  );
};

export default RegisterPage;
