import React from "react";
import { Posts } from "../../../components/authenticated/posts";

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Posts />
    </div>
  );
};

export default HomePage;
