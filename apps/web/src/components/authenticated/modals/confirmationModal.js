export const openConfirmationModal = (message, onConfirm) => {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center";

  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Confirm Action</h2>
      <p>${message}</p>
      <div class="flex justify-between mt-6">
        <button id="cancelAction" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        <button id="confirmAction" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cancelAction").addEventListener("click", () => {
    modal.remove();
  });

  document
    .getElementById("confirmAction")
    .addEventListener("click", async () => {
      await onConfirm();
      modal.remove();
    });
};
