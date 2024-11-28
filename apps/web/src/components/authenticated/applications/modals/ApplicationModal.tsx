import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Select } from "../../../Select";
import { TextArea } from "../../../TextArea";
import { Instrument } from "../../../../enums/Instrument";
import { ApplicationRequest } from "../../../../services/ApplicationService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ApplicationRequest) => Promise<void>;
}

export const ApplicationModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [instrument, setInstrument] = useState<Instrument | "">("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrument) return;

    try {
      await onConfirm({
        instrument,
        message: message || undefined,
      });
      setInstrument("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Failed to submit application:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded bg-white p-8">
          <Dialog.Title className="text-xl font-medium mb-6">Apply for Position</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Select an instrument"
              onChange={(e) => setInstrument(e.target.value as Instrument | "")}
              options={Object.values(Instrument).map((inst) => inst.toString())}
            />

            <TextArea
              name="message"
              label="Message (Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to join..."
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!instrument}
                className="px-6 py-2.5 bg-steel-blue text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
