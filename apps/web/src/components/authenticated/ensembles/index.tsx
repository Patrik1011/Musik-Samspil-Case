import { useState, useEffect, useCallback } from "react";
import { Ensemble, ensembleService } from "../../../services/EnsembleService";
import { CreateEnsembleModal } from "./modals/CreateEnsembleModal";
import { useNavigate } from "react-router-dom";
import CreatePostButton from "../../common/posts/CreatePostButton";

export const Ensembles = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEnsembles = useCallback(async () => {
    try {
      const data = await ensembleService.getHostedEnsembles();
      setEnsembles(data);
    } catch (error) {
      console.error("Failed to fetch ensembles:", error);
    }
  }, []);

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
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Open Positions</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {ensemble.open_positions.map((position) => (
                      <li key={position}>{position}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
