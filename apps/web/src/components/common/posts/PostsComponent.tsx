import { useEffect, useState } from "react";
import { PostDetails, postService } from "../../../services/PostService";
import { ApplicationModal } from "../../authenticated/applications/modals/ApplicationModal";
import { ApplicationRequest } from "../../../services/ApplicationService";

export const PostsComponent = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleApply = (postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = async (data: ApplicationRequest) => {
    if (!selectedPostId) return;
    try {
      await postService.applyForPost(selectedPostId, data);
      setIsModalOpen(false);
      setSelectedPostId(null);
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="space-y-2">
                  <div className="flex items-start w-full">
                    <span className="text-gray-500 font-medium w-20">Website:</span>
                    <a href={post.website_url} className="text-steel-blue hover:underline ml-2">
                      {post.website_url}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 font-medium w-20">Type:</span>
                    <span className="capitalize">{post.type}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleApply(post._id)}
                  className="w-full bg-steel-blue text-white py-3 rounded-md hover:bg-opacity-90 transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPostId(null);
        }}
        onConfirm={handleApplicationSubmit}
      />
    </div>
  );
};
