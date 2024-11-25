import React from "react";
import { Layout } from "../unauthenticated/auth/Layout.tsx";
import { Onboarding } from "../../components/authenticated/Onboarding.tsx";

const OnBoarding: React.FC = () => {
  return (
    <div>
      <Layout>
        <Onboarding />
      </Layout>
    </div>
  );
};

export default OnBoarding;
