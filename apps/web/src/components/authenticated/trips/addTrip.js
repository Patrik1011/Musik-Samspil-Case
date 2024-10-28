import { postTrip } from '../../../utils/api.js';

export const addTripForm = () => {
  const form = document.getElementById('tripForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await postTrip(formData);

      if (response) {
        alert('Trip added successfully!');

        form.reset();

        window.location.href = '/authenticated/trips';
      } else {
        throw new Error('Failed to add trip');
      }
    } catch (error) {
      console.error(error);

      alert('Error adding trip. Please try again.');
    }
  });
};
