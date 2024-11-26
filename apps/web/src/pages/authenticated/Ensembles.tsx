import { useEffect, useState } from "react";
import { ensembleService, type Ensemble } from "../../services/EnsembleService";

const EnsemblesPage = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchEnsembles();
  }, []);

  const fetchEnsembles = async () => {
    try {
      const ensemblesList = await ensembleService.getHostedEnsembles();
      console.log("list: ", ensemblesList);
      setEnsembles(ensemblesList);
    } catch (err) {
      console.error("Failed to load ensembles", err);
      setError("Failed to load ensembles");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Ensembles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ensembles.map((ensemble) => (
          <div
            key={ensemble._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{ensemble.name}</h2>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnsemblesPage;
