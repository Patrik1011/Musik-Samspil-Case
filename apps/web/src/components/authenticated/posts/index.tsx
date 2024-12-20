import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PostDetails,
  postService,
  SearchCriteria,
} from "../../../services/PostService.ts";
import { Container } from "../../Container.tsx";
import { Headline } from "../../Headline.tsx";
import { PostGrid } from "./post-card/PostGrid.tsx";
import SearchPosts from "./SearchPosts.tsx";

export const UserPosts = () => {
  const [allPosts, setPosts] = useState<PostDetails[]>([]);
  const [showingPosts, setShowingPosts] = useState<PostDetails[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    location: "",
    instrument: "",
    genericText: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setShowingPosts(allPosts);
  }, [allPosts]);

  const fetchPosts = async () => {
    const posts = await postService.getPosts();
    setPosts(posts);
  };

  const searchPost = async (
    criteria: Partial<SearchCriteria>,
    callingFor?: string,
  ) => {
    try {
      if (callingFor === "clear") {
        const data = await postService.searchPost(criteria);
        setShowingPosts(data);
        return;
      }
      const updatedCriteria = { ...searchCriteria, ...criteria };
      setSearchCriteria(updatedCriteria);
      const data = await postService.searchPost(updatedCriteria);
      setShowingPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handlePostClick = (id: string) => {
    navigate(`/post-details/${id}`);
  };

  const clearSearchCriteria = (field: keyof SearchCriteria) => {
    setSearchCriteria((prev) => ({ ...prev, [field]: "" }));

    if (searchCriteria.genericText) {
      searchPost({ genericText: searchCriteria.genericText }, "clear");
    } else {
      fetchPosts();
    }
  };

  return (
    <div className="h-full">
      <Container className="my-10">
        <Headline title="Posts" textColor="text-steel-blue" />
        <SearchPosts
          searchCriteria={searchCriteria}
          searchPost={searchPost}
          clearSearchCriteria={clearSearchCriteria}
        />
      </Container>

      <div className="bg-[#F5F5F5] pt-3">
        <Container>
          {showingPosts.length > 0 ? (
            <PostGrid posts={showingPosts} handlePostClick={handlePostClick} />
          ) : (
            <div className="flex flex-col items-center justify-center mb-4 h-20">
              <Headline title="No posts found" textColor="text-steel-blue" />
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
