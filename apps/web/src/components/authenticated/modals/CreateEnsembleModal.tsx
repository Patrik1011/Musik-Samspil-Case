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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Open Positions</label>
              <select
                multiple
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.openPositions}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(option => option.value as Instrument);
                  setFormData({ ...formData, openPositions: selected });
                }}
              >
                {Object.values(Instrument).map((instrument) => (
                  <option key={instrument} value={instrument}>
                    {instrument}
                  </option>
                ))}
              </select>
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