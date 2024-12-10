import { Headline } from "../../Headline.tsx";
import { PostDetails, postService } from "../../../services/PostService.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostGrid } from "./post-card/PostGrid.tsx";
import { Container } from "../../Container.tsx";

export const UserPosts = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const posts = await postService.getPosts();
    setPosts(posts);
  };

  const handlePostClick = (id: string) => {
    navigate(`/post-details/${id}`);
  };

  return (
    <Container className="my-10">
      <Headline title="Posts" textColor="text-steel-blue" />
      <PostGrid posts={posts} handlePostClick={handlePostClick} />
    </Container>
  );
};
