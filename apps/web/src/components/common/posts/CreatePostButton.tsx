import React, { useState } from "react";
import { CreatePostModal } from "./modals/CreatePostModal";
import { Button } from "../../Button";
interface Props {
  ensembleId: string;
}

const CreatePostButton = ({ ensembleId }: Props) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  return (
    <div>
      <Button
        title="Create a Post"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          setIsCreatePostModalOpen(true);
        }}
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        ensembleId={ensembleId}
      />
    </div>
  );
};

export default CreatePostButton;
