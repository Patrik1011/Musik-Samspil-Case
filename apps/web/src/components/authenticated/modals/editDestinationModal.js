import { updateDestination } from '../../../utils/api.js';

import { loadDestinations } from '../destinations/loadDestinations.js';

export function openEditModal(destination) {
  const modal = document.createElement('div');

  modal.className =
    'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';

  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
      <h2 class="text-3xl font-bold mb-6">Edit Destination</h2>
      <form id="editDestinationForm" class="space-y-6">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Title
          </label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" name="title" type="text" value="${destination.title}" required>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40" id="description" name="description" required>${destination.description}</textarea>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="country">
            Country
          </label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" name="country" type="text" value="${destination.country}" required>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
            Update Image
          </label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="image" name="image" type="file" accept="image/*">
        </div>
        <div class="flex items-center justify-between mt-8">
          <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" type="button" id="cancelEdit">
            Cancel
          </button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = document.getElementById('editDestinationForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      await updateDestination(destination._id, formData);

      modal.remove();

      loadDestinations();
    } catch (error) {
      console.error('Error updating destination:', error);

      alert('Failed to update destination. Please try again.');
    }
  });

  const cancelButton = document.getElementById('cancelEdit');

  cancelButton.addEventListener('click', () => {
    modal.remove();
  });
}
