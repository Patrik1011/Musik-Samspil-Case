import { Dialog } from "@headlessui/react";
import { useState } from "react";
import {
  CreatePostInput,
  postService,
} from "../../../../services/PostService.ts";
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
        <Dialog.Panel className="mx-auto max-w-xl rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Create a post
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <InputField
                id="title"
                name="title"
                label="Title"
                type="text"
                value={formData.title}
                placeholder="Enter a title"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <TextArea
                name="description"
                label="Description"
                value={formData.description}
                placeholder="Enter a description"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <InputField
                id="website_url"
                name="website_url"
                label="Website URL"
                type="text"
                value={formData.website_url}
                placeholder="Enter a website URL"
                onChange={(e) =>
                  setFormData({ ...formData, website_url: e.target.value })
                }
              />

              <Select
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                }}
                options={Object.values(PostType).map((type) => type.toString())}
                label="Select a post type"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
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
