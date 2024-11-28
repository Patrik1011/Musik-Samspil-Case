import React from "react";
import { Layout } from "../../unauthenticated/auth/Layout.tsx";
import { Onboarding } from "../../../components/authenticated/onboarding/Onboarding.tsx";

const Index: React.FC = () => {
  return (
    <div>
      <Layout>
        <Onboarding />
      </Layout>
    </div>
  );
};

export default Index;
