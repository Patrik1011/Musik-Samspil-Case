import React from "react";
import { Layout } from "../../unauthenticated/auth/Layout.tsx";
import { Matchmaking } from "../../../components/authenticated/matchmaking";

const Index: React.FC = () => {
  return (
    <div>
      <Layout>
        <Matchmaking />
      </Layout>
    </div>
  );
};

export default Index;
