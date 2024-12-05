import { Dialog } from "@headlessui/react";
import { CreateEnsembleInput, ensembleService } from "../../../../services/EnsembleService";
import { useState } from "react";
import { Instrument } from "../../../../enums/Instrument";
import { Button } from "../../../Button.tsx";
import { Ensemble } from "../../../../utils/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ensembles: Ensemble[];
}

export const CreateEnsembleModal = ({ isOpen, onClose, onSuccess, ensembles }: Props) => {
  const [formData, setFormData] = useState<CreateEnsembleInput>({
    name: "",
    description: "",
    location: {
      city: "",
      country: "",
      address: "",
    },
    open_positions: [] as Instrument[],
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isDuplicate = ensembles.some(
        (ensemble) => ensemble.name.toLowerCase() === formData.name.toLowerCase(),
      );

      if (isDuplicate) {
        setError("An ensemble with this name already exists");
        return;
      }

      await ensembleService.createEnsemble(formData);
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create ensemble:", error);
      setError("Failed to create ensemble");
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value,
      },
    }));
  };

  const handleOpenPositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstrument = e.target.value as Instrument;
    setFormData((prevData) => ({
      ...prevData,
      open_positions: [...prevData.open_positions, selectedInstrument],
    }));
  };

  const removeOpenPosition = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      open_positions: prevData.open_positions.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-transparent-black" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded bg-white p-8">
          <Dialog.Title className="text-xl font-medium mb-6">Create New Ensemble</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
            <div>
              <label htmlFor="ensemble-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="ensemble-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="ensemble-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="ensemble-description"
                name="description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Location</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="ensemble-city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="ensemble-city"
                    type="text"
                    name="city"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="ensemble-country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    id="ensemble-country"
                    type="text"
                    name="country"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.location.country}
                    onChange={handleLocationChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="ensemble-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="ensemble-address"
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
              <label
                htmlFor="ensemble-open-positions"
                className="block text-sm font-medium text-gray-700"
              >
                Open Positions
              </label>
              <select
                id="ensemble-open-positions"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleOpenPositionChange}
                value=""
              >
                <option value="" disabled>
                  Select an instrument
                </option>
                {Object.values(Instrument).map((instrument) => (
                  <option key={instrument} value={instrument}>
                    {instrument}
                  </option>
                ))}
              </select>
              <div className="mt-2 space-y-2">
                {formData.open_positions.map((position, index) => (
                  <div
                    key={position}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
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
              <Button
                title="Cancel"
                type="button"
                onClick={onClose}
                className="bg-gray-50 text-gray-900"
              />
              <Button title="Create" type="submit" className="bg-steel-blue text-white" />
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
