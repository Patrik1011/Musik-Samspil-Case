import React from "react";
import { UserPosts } from "../../components/authenticated/posts/applications";

const PostsPage: React.FC = () => {
  return (
    <div>
      <UserPosts />
    </div>
  );
};

export default PostsPage;
