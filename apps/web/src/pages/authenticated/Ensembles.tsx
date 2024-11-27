import { useState, useEffect } from "react";
import { Ensemble, ensembleService } from "../../services/EnsembleService";
import { CreateEnsembleModal } from "../../components/authenticated/ensembles/modals/CreateEnsembleModal";
import { useNavigate } from "react-router-dom";

const EnsemblesPage = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEnsembles = async () => {
    try {
      const data = await ensembleService.getHostedEnsembles();
      setEnsembles(data);
    } catch (error) {
      console.error("Failed to fetch ensembles:", error);
    }
  };

  useEffect(() => {
    fetchEnsembles();
  }, []);

  const handleEnsembleClick = (ensembleId: string) => {
    navigate(`/ensembles/${ensembleId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Ensembles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
          <div
            key={ensemble._id}
            onClick={() => handleEnsembleClick(ensemble._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {ensemble.name}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {ensemble.description}
              </p>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Location
                </h4>
                <p className="text-sm text-gray-600">
                  {ensemble.location.city}, {ensemble.location.country}
                </p>
              </div>
              {ensemble.open_positions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Open Positions
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {ensemble.open_positions.map((position) => (
                      <li key={position}>{position}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnsemblesPage;
