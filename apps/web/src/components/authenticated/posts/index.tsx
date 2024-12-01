import { useEffect, useState } from "react";
import { PostDetails, postService } from "../../../services/PostService.ts";
import { applicationService } from "../../../services/ApplicationService.ts";
import { ApplicationModal } from "../applications/modals/ApplicationModal.tsx";
import { ApplicationRequest } from "../../../services/ApplicationService.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import homeImage from "../../../assets/images-svg/home.svg";
import { Select } from "../../Select.tsx";
import { Instrument } from "../../../enums/Instrument.ts";
import { Button } from "../../Button.tsx";

export const Posts = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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

  const handleApply = (post: PostDetails) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = async (data: ApplicationRequest) => {
    if (!selectedPost) return;
    try {
      await applicationService.applyForPost(selectedPost._id, data);
      setIsModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid flex-col grid-cols-2">
        <div>
          <p className="text-[50px] text-custom-red font-oswald">
            The place where amateur musicians find each other and play music together
          </p>
          <div className="flex items-center justify-between">
            <Select
              onChange={() => console.log()}
              options={Object.values(Instrument).map((type) => type.toString())}
            />
            <Button title="See posts" className="text-white bg-steel-blue" />
          </div>
        </div>
        <img src={homeImage} alt="pale" className="justify-self-end" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="space-y-2">
                <div className="flex items-start w-full">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">Website:</span>
                  <a
                    href={post.website_url}
                    className="text-steel-blue hover:underline ml-2 truncate"
                    title={post.website_url}
                  >
                    {post.website_url}
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">Type:</span>
                  <span className="capitalize">{post.type}</span>
                </div>
              </div>

              {post.ensemble_id && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Open Positions</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.ensemble_id.open_positions.map((position) => (
                      <span
                        key={position}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-steel-blue bg-opacity-10 text-steel-blue"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => handleApply(post)}
                className="mt-6 w-full bg-steel-blue text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Apply
              </button>
            ) : (
              <a
                href="/login"
                className="mt-6 w-full bg-steel-blue text-white px-4 py-2 rounded-md hover:bg-opacity-90 text-center block"
              >
                Sign in
              </a>
            )}
          </div>
        ))}
      </div>

      {selectedPost && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPost(null);
          }}
          onConfirm={handleApplicationSubmit}
          open_positions={selectedPost.ensemble_id?.open_positions || []}
        />
      )}
    </div>
  );
};
