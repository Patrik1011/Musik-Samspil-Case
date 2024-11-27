import { Dialog } from "@headlessui/react";
import { CreateEnsembleInput, ensembleService } from "../../../services/EnsembleService"; 
import { useState } from "react";
import { Instrument } from "../../../enums/Instrument";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEnsembleModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState<CreateEnsembleInput>({
    name: "",
    description: "",
    location: {
      city: "",
      country: "",
      address: "",
    },
    openPositions: [],
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ensembleService.createEnsemble(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create ensemble:", error);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value
      }
    }));
  };

  const handleOpenPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstrument = e.target.value as Instrument;
    setFormData(prevData => ({
      ...prevData,
      openPositions: [...prevData.openPositions, selectedInstrument]
    }));
  };

  const removeOpenPosition = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      openPositions: prevData.openPositions.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Create New Ensemble</Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Location</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location.country}
                    onChange={handleLocationChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location.address}
                    onChange={handleLocationChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Open Positions</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleOpenPositionChange}
                value=""
              >
                <option value="" disabled>Select an instrument</option>
                {Object.values(Instrument).map((instrument) => (
                  <option key={instrument} value={instrument}>
                    {instrument}
                  </option>
                ))}
              </select>
              <div className="mt-2 space-y-2">
                {formData.openPositions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{position}</span>
                    <button
                      type="button"
                      onClick={() => removeOpenPosition(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
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