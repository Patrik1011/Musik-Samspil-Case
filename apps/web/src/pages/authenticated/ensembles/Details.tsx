import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ensemble, ensembleService } from "../../../services/EnsembleService";

const EnsembleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEnsemble(id);
    }
  }, [id]);

  const fetchEnsemble = async (ensembleId: string) => {
    try {
      const data = await ensembleService.getEnsemble(ensembleId);
      setEnsemble(data);
    } catch (error) {
      console.error("Failed to fetch ensemble:", error);
    }
  };

  if (!ensemble) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/ensembles")}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Ensembles
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{ensemble.name}</h1>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {isEditing ? "Cancel Edit" : "Edit Ensemble"}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{ensemble.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Location</h2>
            <p className="text-gray-600">
              {ensemble.location.address}
              <br />
              {ensemble.location.city}, {ensemble.location.country}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Open Positions</h2>
            <ul className="list-disc list-inside text-gray-600">
              {ensemble.open_positions.map((position) => (
                <li key={position}>{position}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnsembleDetail;
