import { useState, useEffect, useCallback } from "react";
import { Ensemble, ensembleService } from "../../../services/EnsembleService";
import { CreateEnsembleModal } from "./modals/CreateEnsembleModal";
import { useNavigate } from "react-router-dom";
import CreatePostButton from "../../common/posts/CreatePostButton";

export const Ensembles = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [members, setMembers] = useState<Record<string, EnsembleMember[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      // Fetch members for each ensemble
      data.forEach((ensemble) => fetchEnsembleMembers(ensemble._id));
    } catch (error) {
      console.error("Failed to fetch ensembles:", error);
    }
  }, [fetchEnsembleMembers]);

  useEffect(() => {
    fetchEnsembles();
  }, [fetchEnsembles]);

  const handleEnsembleClick = (ensembleId: string) => {
    navigate(`/ensembles/${ensembleId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Ensembles</h1>
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
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ensembles.map((ensemble) => (
          <button
            type="button"
            key={ensemble._id}
            onClick={() => handleEnsembleClick(ensemble._id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEnsembleClick(ensemble._id);
              }
            }}
            className="w-full text-left bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-steel-blue"
          >
            <div className="px-2 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 ml-4">{ensemble.name}</h2>
              <CreatePostButton ensembleId={ensemble._id} />
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">{ensemble.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Location</h4>
                <p className="text-sm text-gray-600">
                  {ensemble.location.city}, {ensemble.location.country}
                </p>
              </div>

              {ensemble.open_positions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Open Positions</h4>
                  <div className="flex flex-wrap gap-2">
                    {ensemble.open_positions.map((position) => (
                      <span
                        key={position}
                        className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Members</h4>
                <div className="flex flex-wrap gap-3">
                  {members[ensemble._id]?.map((membership) => (
                    <div
                      key={membership._id}
                      className="flex items-center bg-gray-50 px-4 py-3 rounded-lg"
                    >
                      <span className="text-base font-medium text-gray-800 mr-3">
                        {membership.member.first_name} {membership.member.last_name}
                      </span>
                      {membership.is_host ? (
                        <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">
                          Host
                        </span>
                      ) : (
                        <span className="text-sm bg-steel-blue bg-opacity-10 text-steel-blue px-3 py-1.5 rounded-full">
                          {membership.instrument}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
