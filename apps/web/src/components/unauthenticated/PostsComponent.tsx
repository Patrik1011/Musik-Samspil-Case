import { Headline } from "../Headline.tsx";
import { Post, postService } from "../../services/PostService.ts";
import { useEffect, useState, useCallback } from "react";

export const PostsComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Headline title="Posts" textColor="text-steel-blue" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            // onClick={() => handleEnsembleClick(ensemble._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">{post.description}</p>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Website</h4>
                <p className="text-sm text-gray-600">{post.website_url}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Type</h4>
                <p className="text-sm text-gray-600">{post.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
