import { Button } from "../../Button.tsx";
import { useNavigate } from "react-router-dom";
import userImage from "../../../assets/images-svg/user.svg";
import { Headline } from "../../Headline.tsx";
import { Paragraph } from "../../Paragraph.tsx";
import { useEffect, useState } from "react";
import { userService } from "../../../services/UserService.ts";
import { UserEntity } from "../../../utils/types.ts";
import { PostDetails, postService } from "../../../services/PostService.ts";
import { ConfirmationModal } from "../../ConfirmationModal.tsx";
import { Container } from "../../Container.tsx";
import { EmptyState } from "../../EmptyState.tsx";
import { PostGrid } from "../posts/post-card/PostGrid.tsx";

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
    const posts = await postService.getPostsByUser();
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
    <Container className="my-10">
      <section>
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center w-[98px] h-[98px] p-4 rounded-[20px] bg-pale-gray border-4 border-white shadow-lg">
            <img src={userImage} alt="user" />
          </div>
          <div className="ml-8">
            <Headline title={`${user.first_name} ${user.last_name}`} textColor="text-custom-red" />
            <Paragraph content={user.email} className="mt-4" />
            <Paragraph content={user.phone_number} />
            {user.location?.address && <Paragraph content={user.location.address} />}
            {(user.location?.city || user.location?.country) && (
              <Paragraph
                content={`${user.location?.city || ""}, ${user.location?.country || ""}`}
              />
            )}
          </div>
        </div>
        <Button
          title="Update Profile"
          onClick={handleUpdateProfile}
          className="text-steel-blue bg-white shadow border border-soft-gray mt-8"
        />
      </section>
      <section className="mt-8 md:mt-12">
        <Headline title="My Posts" textColor="text-steel-blue" className="font-oswald" />
        {userPosts.length > 0 ? (
          <PostGrid
            posts={userPosts}
            handlePostClick={handlePostClick}
            isPostCardAdmin={true}
            onDeleteButtonClick={handleDeletePostClick}
          />
        ) : (
          <div className="flex justify-center items-center mt-8">
            <EmptyState message="posts" onClick={() => navigate("/ensembles")} />
          </div>
        )}
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
    </Container>
  );
};
