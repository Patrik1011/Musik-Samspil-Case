import { updateTrip } from '../../../utils/api.js';

export function openEditTripModal(trip) {
  const modal = document.createElement('div');

  modal.className =
    'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';

  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
      <h2 class="text-3xl font-bold mb-6">Edit Trip</h2>
      <form id="editTripForm" class="space-y-6">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" name="title" type="text" value="${trip.title}" required>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
          <textarea class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40" id="description" name="description" required>${trip.description}</textarea>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="start_date">Start Date</label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="start_date" name="start_date" type="date" value="${trip.start_date}" required>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="end_date">End Date</label>
          <input class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="end_date" name="end_date" type="date" value="${trip.end_date}" required>
        </div>
        <div class="flex items-center justify-between mt-8">
          <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" type="button" id="cancelEdit">Cancel</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" type="submit">Update</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = document.getElementById('editTripForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      await updateTrip(trip._id, formData);

      modal.remove();

      window.location.reload();
    } catch (error) {
      console.error('Error updating trip:', error);

      alert('Failed to update trip. Please try again.');
    }
  });

  const cancelButton = document.getElementById('cancelEdit');

  cancelButton.addEventListener('click', () => {
    modal.remove();
  });
}
