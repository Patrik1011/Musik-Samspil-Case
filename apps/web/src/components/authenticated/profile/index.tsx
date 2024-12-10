import { Button } from "../../Button.tsx";
import { useNavigate } from "react-router-dom";
import userImage from "../../../assets/images-svg/user.svg";
import { Headline } from "../../Headline.tsx";
import { Paragraph } from "../../Paragraph.tsx";
import { useEffect, useState } from "react";
import { userService } from "../../../services/UserService.ts";
import { UserEntity } from "../../../utils/types.ts";
import { PostCard } from "../posts/PostCard.tsx";
import { PostDetails, postService } from "../../../services/PostService.ts";
import { ConfirmationModal } from "../../ConfirmationModal.tsx";

export const Profile = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [userPosts, setUserPosts] = useState<PostDetails[]>([]);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    const posts = await postService.getPostsByUserId();
    setUserPosts(posts);
  };

  const handleDeletePostClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await postService.deletePost(postToDelete);
      setUserPosts(userPosts.filter((post) => post._id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post-application/${postId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <section>
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center w-[98px] h-[98px] p-4 rounded-[20px] bg-light-gray border-4 border-white shadow-lg">
            <img src={userImage} alt="user" />
          </div>
          <div className="ml-8">
            <Headline title={`${user.first_name} ${user.last_name}`} textColor="text-custom-red" />
            <Paragraph content={user.email} className="mt-4" />
            <Paragraph content={user.phone_number} />
          </div>
        </div>
        <Button
          title="Update Profile"
          onClick={handleUpdateProfile}
          className="text-steel-blue bg-white shadow border border-soft-gray mt-8"
        />
      </section>
      <section>
        <Headline title="My Posts" textColor="text-steel-blue" className="text-4xl font-oswald" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePostClick(post._id);
                }
              }}
            >
              <PostCard
                key={post._id}
                postId={post._id}
                title={post.title}
                firstName={post.author_id.first_name}
                lastName={post.author_id.last_name}
                description={post.description}
                type={post.type}
                website={post.website_url}
                createdAt={post.created_at}
                instruments={post.ensemble_id.open_positions}
                location={`${post.ensemble_id.location.city}, ${post.ensemble_id.location.country}`}
                isPostCardAdmin={true}
                onDeleteButtonClick={() => handleDeletePostClick(post._id)}
              />
            </div>
          ))}
        </div>
      </section>
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDeletePost}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
