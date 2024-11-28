import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ensemble, EnsembleMember, ensembleService } from "../../../../services/EnsembleService";
import { Instrument } from "../../../../enums/Instrument";

export const EnsembleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [members, setMembers] = useState<EnsembleMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Ensemble>>({});

  useEffect(() => {
    if (id) {
      fetchEnsemble(id);
      fetchEnsembleMembers(id);
    }
  }, [id]);

  useEffect(() => {
    if (ensemble) {
      setFormData(ensemble);
    }
  }, [ensemble]);

  const fetchEnsemble = async (ensembleId: string) => {
    try {
      const data = await ensembleService.getEnsemble(ensembleId);
      setEnsemble(data);
    } catch (error) {
      console.error("Failed to fetch ensemble:", error);
    }
  };

  const fetchEnsembleMembers = async (ensembleId: string) => {
    try {
      const memberData = await ensembleService.getEnsembleMembers(ensembleId);
      setMembers(memberData);
    } catch (error) {
      console.error("Failed to fetch ensemble members:", error);
    }
  };

  const handleSubmit = async () => {
    if (!ensemble?._id) return;

    try {
      await ensembleService.updateEnsemble(ensemble._id, formData);
      setIsEditing(false);
      fetchEnsemble(ensemble._id);
    } catch (error) {
      console.error("Failed to update ensemble:", error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        city: prev.location?.city ?? "",
        country: prev.location?.country ?? "",
        address: prev.location?.address ?? "",
        [name]: value,
      },
    }));
  };

  const handleOpenPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstrument = e.target.value as Instrument;
    setFormData((prev) => ({
      ...prev,
      open_positions: [...(prev.open_positions || []), selectedInstrument],
    }));
  };

  const removeOpenPosition = (positionToRemove: Instrument) => {
    setFormData((prev) => ({
      ...prev,
      open_positions: prev.open_positions?.filter((position) => position !== positionToRemove),
    }));
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
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{ensemble.name}</h1>
          )}
          <button
            type="button"
            onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
            className="bg-steel-blue text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {isEditing ? "Save Changes" : "Edit Ensemble"}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />
            ) : (
              <p className="text-gray-600">{ensemble.description}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Location</h2>
            {isEditing ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  name="city"
                  value={formData.location?.city}
                  onChange={handleLocationChange}
                  placeholder="City"
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.location?.country}
                  onChange={handleLocationChange}
                  placeholder="Country"
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.location?.address}
                  onChange={handleLocationChange}
                  placeholder="Address"
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {ensemble.location.address}
                <br />
                {ensemble.location.city}, {ensemble.location.country}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Open Positions</h2>
            {isEditing && (
              <select
                onChange={handleOpenPositionChange}
                value=""
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Add a position
                </option>
                {Object.values(Instrument).map((instrument) => (
                  <option key={instrument} value={instrument}>
                    {instrument}
                  </option>
                ))}
              </select>
            )}
            <ul className="list-disc list-inside text-gray-600">
              {(isEditing ? formData.open_positions : ensemble.open_positions)?.map((position) => (
                <li key={position} className="flex items-center space-x-2">
                  <span>{position}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeOpenPosition(position)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Members</h2>
            <div className="flex flex-wrap gap-3">
              {members.map((membership) => (
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
      </div>
    </div>
  );
};

export default EnsembleDetail;
