interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-md bg-white rounded-lg shadow-lg">
        <div className="px-4 py-2 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end px-4 py-2 space-x-2 border-t">
          <button
            type="button"
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
