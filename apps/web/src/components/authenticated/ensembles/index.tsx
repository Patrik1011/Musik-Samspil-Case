import { useState, useEffect, useCallback } from "react";
import { Ensemble, ensembleService } from "../../../services/EnsembleService";
import { postService } from "../../../services/PostService";
import { CreateEnsembleModal } from "./modals/CreateEnsembleModal";
import { useNavigate } from "react-router-dom";
import CreatePostButton from "../posts/buttons/CreatePostButton";
import { Headline } from "../../Headline";
import { EnsembleMember } from "../../../utils/types";

export const Ensembles = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [members, setMembers] = useState<Record<string, EnsembleMember[]>>({});
  const [ensemblesPosts, setEnsemblesPosts] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEnsemblePosts = useCallback(async () => {
    try {
      const posts = await postService.getPosts();
      const postsByEnsemble = posts.reduce(
        (acc, post) => {
          if (post.ensemble_id?._id) {
            acc[post.ensemble_id._id] = post._id;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
      setEnsemblesPosts(postsByEnsemble);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  const fetchEnsembleMembers = useCallback(async (ensembleId: string) => {
    try {
      const memberData = await ensembleService.getEnsembleMembers(ensembleId);
      setMembers((prev) => ({
        ...prev,
        [ensembleId]: memberData,
      }));
    } catch (error) {
      console.error("Failed to fetch ensemble members:", error);
    }
  }, []);

  const fetchEnsembles = useCallback(async () => {
    try {
      const data = await ensembleService.getHostedEnsembles();
      setEnsembles(data);
      data.forEach((ensemble) => fetchEnsembleMembers(ensemble._id));
    } catch (error) {
      console.error("Failed to fetch ensembles:", error);
    }
  }, [fetchEnsembleMembers]);

  useEffect(() => {
    fetchEnsembles();
    fetchEnsemblePosts();
  }, [fetchEnsembles, fetchEnsemblePosts]);

  const handleEnsembleClick = (ensembleId: string) => {
    navigate(`/ensembles/${ensembleId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <Headline title="Your Ensembles" textColor="text-steel-blue" />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-steel-blue text-white px-4 py-2 rounded-md hover:bg-opacity-90"
        >
          Add New Ensemble
        </button>
      </div>

      <CreateEnsembleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEnsembles}
        ensembles={ensembles}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ensembles.map((ensemble) => (
          <div
            key={ensemble._id}
            onClick={() => handleEnsembleClick(ensemble._id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEnsembleClick(ensemble._id);
              }
            }}
            className="w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-steel-blue flex flex-col h-fit"
          >
            <div className="px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 truncate">{ensemble.name}</h2>
            </div>
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-8">{ensemble.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">
                    {ensemble.location.city}, {ensemble.location.country}
                  </p>
                </div>

                {ensemble.open_positions.length > 0 && (
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">Open Positions</h4>
                    <div className="flex flex-wrap gap-2">
                      {ensemble.open_positions.map((position) => (
                        <span
                          key={position}
                          className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm"
                        >
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-3">Members</h4>
                  <div className="space-y-2">
                    {members[ensemble._id]?.map((membership) => (
                      <div key={membership._id} className="flex items-center justify-between py-2">
                        <span className="text-gray-900">
                          {membership.member.first_name} {membership.member.last_name}
                        </span>
                        {membership.is_host ? (
                          <span className="text-sm bg-amber-50 text-amber-700 px-4 py-1 rounded-full">
                            Host
                          </span>
                        ) : (
                          <span className="text-sm bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                            {membership.instrument}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <CreatePostButton
                  ensembleId={ensemble._id}
                  existingPostId={ensemblesPosts[ensemble._id]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
