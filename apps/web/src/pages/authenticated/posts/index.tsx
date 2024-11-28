import React from "react";
import { UserPosts } from "../../../components/authenticated/posts/applications/index.tsx";

const PostApplications: React.FC = () => {
  return (
    <div>
      <UserPosts />
    </div>
  );
};

export default PostApplications;
