import React from "react";
import { PostsComponent } from "../../../components/authenticated/posts/PostsComponent.tsx";

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-indigo-100">
      <PostsComponent />
    </div>
  );
};

export default HomePage;
