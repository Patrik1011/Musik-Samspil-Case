import { postDestination } from '../../../utils/api.js';

export const addDestinationForm = () => {
  const form = document.getElementById('destinationForm');

  const fileInput = document.querySelector('input[type="file"][name="image_url"]');
  
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 5 MB. Please select a smaller file.');
        event.target.value = ''; 
      }
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (file) {
      const allowedTypes = ['image/png'];

      if (!allowedTypes.includes(file.type)) {
        alert('File must be a PNG.');
        return; 
      }
    }

    const formData = new FormData(form);

    try {
      const response = await postDestination(formData);

      if (response) {
        alert('Destination added successfully!');
        form.reset();
        window.location.href = '/authenticated/destinations';
      } else {
        throw new Error('Failed to add destination');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding destination. Please try again.');
    }
  });
};
