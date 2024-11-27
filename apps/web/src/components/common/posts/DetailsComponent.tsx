import { PostDetails, postService } from "../../../services/PostService.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../../ConfirmationModal.tsx";

export const DetailsComponent = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const data = await postService.getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="font-bold">Post Details</h1>
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p>{post.website_url}</p>
          <p>{post.type}</p>
          <p>{post.created_at}</p>
          <h1 className="font-bold">Data about the user</h1>
          {post.author_id && (
            <>
              <p>{post.author_id.email}</p>
              <p>{post.author_id.first_name}</p>
              <p>{post.author_id.last_name}</p>
              <p>{post.author_id.phone_number}</p>
            </>
          )}
          <h1 className="font-bold">Data about the ensemble</h1>
          {post.ensemble_id && (
            <>
              <p>{post.ensemble_id.location.city}</p>
              <p>{post.ensemble_id.location.country}</p>
              <p>{post.ensemble_id.location.address}</p>
              <p>{post.ensemble_id._id}</p>
              <p>{post.ensemble_id.name}</p>
              <p>{post.ensemble_id.description}</p>
              <h1 className="font-bold">positions</h1>
              <p>{post.ensemble_id.open_positions.join(", ")}</p>
              <p>{post.ensemble_id.is_active ? "Active" : "Inactive"}</p>
              <p>{post.ensemble_id.updatedAt}</p>
            </>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <div>
        <button
          className="px-4 py-2 bg-steel-blue text-sm font-medium text-white border border-gray-300 rounded-md "
          onClick={() => setIsModalOpen(true)}
        >
          Apply for
        </button>

        <ConfirmationModal
          title="Apply for this post"
          message="Are you sure you want to apply for this post?"
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
