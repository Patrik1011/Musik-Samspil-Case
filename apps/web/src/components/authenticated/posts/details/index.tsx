import { postService } from "../../../../services/PostService.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  applicationService,
  ApplicationRequest,
} from "../../../../services/ApplicationService.ts";
import { PostDetails } from "../../../../services/PostService.ts";
import { Button } from "../../../Button.tsx";
import { PostDetailsInfo } from "./PostDetailsInfo.tsx";
import { EnsembleDetails } from "./EnsembleDetails.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store.ts";
import { ApplicationModal } from "../../applications/modals/ApplicationModal.tsx";
import { Container } from "../../../Container.tsx";

export const DetailsComponent = () => {
  const { id } = useParams();
  const [selectedPost, setSelectedPost] = useState<PostDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const data = await postService.getPostById(postId);
      setSelectedPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplicationSubmit = async (data: ApplicationRequest) => {
    if (!selectedPost) return;
    try {
      await applicationService.applyForPost(selectedPost._id, data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  if (!selectedPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steel-blue" />
      </div>
    );
  }

  return (
    <Container className="pt-10">
      <Button
        title="Go back"
        type="button"
        className="text-steel-blue border border-soft-gray bg-white"
        onClick={() => navigate("/")}
      />
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row mt-8 justify-between w-full gap-x-3 items-stretch">
        <div className="md:w-1/2 w-full flex flex-col">
          <PostDetailsInfo
            title={selectedPost.title}
            description={selectedPost.description}
            firstName={selectedPost.author_id.first_name}
            lastName={selectedPost.author_id.last_name}
            website={selectedPost.website_url}
            location={selectedPost.ensemble_id.location}
            type={selectedPost.type}
            createdAt={selectedPost.created_at}
            instruments={selectedPost.ensemble_id.open_positions}
          />
        </div>
        <div className="md:w-1/2 w-full flex flex-col">
          <EnsembleDetails
            name={selectedPost.ensemble_id.name}
            creator={`${selectedPost.author_id.first_name} ${selectedPost.author_id.last_name}`}
            creatorPhone={selectedPost.author_id.phone_number}
            creatorEmail={selectedPost.author_id.email}
            description={selectedPost.ensemble_id.description}
            isActive={selectedPost.ensemble_id.is_active}
            updatedAt={selectedPost.ensemble_id.updatedAt}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          title={isAuthenticated ? "Apply" : "Login to apply"}
          type="button"
          className="text-white bg-steel-blue my-8"
          onClick={() =>
            isAuthenticated ? setIsModalOpen(true) : navigate("/login")
          }
        />
      </div>
      {selectedPost && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onConfirm={handleApplicationSubmit}
          open_positions={selectedPost.ensemble_id.open_positions || []}
        />
      )}
    </Container>
  );
};
