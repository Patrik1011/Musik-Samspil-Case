import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { CreatePostInput, postService } from "../../../../services/PostService.ts";
import { PostType } from "../../../../enums/PostType.ts";
import { Select } from "../../../Select.tsx";
import { InputField } from "../../../InputField.tsx";
import { TextArea } from "../../../TextArea.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ensembleId: string;
}

export const CreatePostModal = ({ isOpen, onClose, ensembleId }: Props) => {
  const [formData, setFormData] = useState<CreatePostInput>({
    title: "",
    description: "",
    website_url: "",
    type: "",
  });

  const clearFormData = () => {
    setFormData({
      title: "",
      description: "",
      website_url: "",
      type: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postService.createPost(formData, ensembleId);
      console.log("Post created:", formData);
      clearFormData();
      onClose();
    } catch (error) {
      console.error("Failed to create ensemble:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded bg-white p-8">
          <Dialog.Title className="text-xl font-medium mb-6">Create a post</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="title"
              name="title"
              label="Title"
              type="text"
              value={formData.title}
              placeholder="Enter a title"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextArea
              name="description"
              label="Description"
              value={formData.description}
              placeholder="Enter a description"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <InputField
              id="website_url"
              name="website_url"
              label="Website URL"
              type="text"
              value={formData.website_url}
              placeholder="Enter a website URL"
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            />

            <Select
              label="Post Type"
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value });
              }}
              options={Object.values(PostType).map((type) => type.toString())}
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-steel-blue text-white rounded-md hover:bg-opacity-90"
              >
                Create
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
