import { Headline } from "../../../Headline.tsx";
import { Post, postService } from "../../../../services/PostService.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../../ConfirmationModal.tsx";

export const UserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const posts = await postService.getPostsByUserId();
    setPosts(posts);
  };

  const handleViewApplicationsClick = (postId: string) => {
    navigate(`/post-application/${postId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      await postService.deletePost(postToDelete);
      setPosts(posts.filter((post) => post._id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Headline title="Posts" textColor="text-steel-blue" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <button
                type="button"
                onClick={(e) => handleDeleteClick(e, post._id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Delete post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  role="img"
                  aria-labelledby={`delete-title-${post._id}`}
                >
                  <title id={`delete-title-${post._id}`}>Delete post</title>
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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
              <div>
                <button
                  type="button"
                  onClick={() => handleViewApplicationsClick(post._id)}
                  className="px-4 py-2 bg-steel-blue text-sm font-medium text-white border border-gray-300 rounded-md"
                >
                  View Applications
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
      />
    </div>
  );
};
