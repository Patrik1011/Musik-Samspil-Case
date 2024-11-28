import React from "react";
import { UserPostsComponent } from "../../../components/authenticated/posts/UserPostsComponent.tsx";

const PostApplications: React.FC = () => {
  return (
    <div>
      <UserPostsComponent />
    </div>
  );
};

export default PostApplications;
