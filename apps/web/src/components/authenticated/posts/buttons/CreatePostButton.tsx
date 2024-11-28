import React, { useState } from "react";
import { CreatePostModal } from "../modals/CreatePostModal.tsx";
import { Button } from "../../../Button.tsx";
import { useNavigate } from "react-router-dom";

interface Props {
  ensembleId: string;
  existingPostId?: string;
}

const CreatePostButton = ({ ensembleId, existingPostId }: Props) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (existingPostId) {
      navigate("/posts");
    } else {
      setIsCreatePostModalOpen(true);
    }
  };

  return (
    <div>
      <Button
        title={existingPostId ? "Go to Post" : "Create a Post"}
        onClick={handleClick}
        className="bg-steel-blue text-white"
      />

      {!existingPostId && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          ensembleId={ensembleId}
        />
      )}
    </div>
  );
};

export default CreatePostButton;
