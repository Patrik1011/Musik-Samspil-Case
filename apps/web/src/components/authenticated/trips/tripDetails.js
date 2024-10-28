import { fetchTripById, fetchDestinations, addDestinationToTrip, removeDestinationFromTrip } from '../../../utils/api.js';

export const loadTripDetails = async (tripId) => {
  console.log('loadTripDetails called with ID:', tripId);
  const tripDetailsContainer = document.getElementById('tripDetails');

  if (!tripDetailsContainer) {
    console.error('Trip details container not found');
    console.log('Current HTML:', document.body.innerHTML);
    return;
  }

  try {
    const [trip, allDestinations] = await Promise.all([
      fetchTripById(tripId),
      fetchDestinations()
    ]);
    console.log('Fetched trip data:', trip);
    
    const tripHTML = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 id="tripTitle" class="text-3xl font-bold mb-4 text-indigo-600"></h2>
          <p id="tripDescription" class="text-gray-600 mb-4"></p>
          <p id="tripDates" class="text-sm text-gray-500 mb-6">
            <span class="font-semibold">Date:</span>
          </p>
          <h3 class="text-2xl font-semibold mb-4 text-indigo-500">Destinations:</h3>
          <div id="destinationSelectContainer" class="mb-4 flex items-center space-x-2">
            <select id="destinationSelect" class="w-2/3 p-2 border border-gray-300 rounded"></select>
            <button id="addDestinationBtn" class="w-1/3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Destination</button>
          </div>
          <div id="tripDestinations" class="space-y-6"></div>
        </div>
      </div>
    `;

    tripDetailsContainer.innerHTML = tripHTML;

    document.getElementById('tripTitle').textContent = trip.title;
    document.getElementById('tripDescription').textContent = trip.description;
    document.getElementById('tripDates').textContent = `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`;

    const destinationSelect = document.getElementById('destinationSelect');
    destinationSelect.innerHTML = '<option value="">Select a destination to add</option>' +
      allDestinations
        .filter(dest => !trip.destinations.some(tripDest => tripDest._id === dest._id))
        .map(dest => `<option value="${dest._id}">${dest.title}</option>`)
        .join('');

    const tripDestinationsContainer = document.getElementById('tripDestinations');
    const destinationItemTemplate = document.getElementById('destinationItemTemplate');
    tripDestinationsContainer.innerHTML = '';

    trip.destinations.forEach(dest => {
      const destinationItem = destinationItemTemplate.content.cloneNode(true);
      const container = destinationItem.querySelector('.destination-item');
      container.dataset.destinationId = dest._id;
      
      const img = destinationItem.querySelector('img');
      img.src = getImageUrl(dest.image_url);
      img.alt = dest.title;
      
      destinationItem.querySelector('h4').textContent = dest.title;
      destinationItem.querySelector('p:nth-of-type(1)').textContent = dest.description;
      destinationItem.querySelector('p:nth-of-type(2)').textContent = dest.country;
      
      const removeBtn = destinationItem.querySelector('.removeDestinationBtn');
      removeBtn.dataset.destinationId = dest._id;
      
      tripDestinationsContainer.appendChild(destinationItem);
    });

    const addDestinationBtn = document.getElementById('addDestinationBtn');
    addDestinationBtn.addEventListener('click', async () => {
      const select = document.getElementById('destinationSelect');
      const selectedDestinationId = select.value;
      if (selectedDestinationId) {
        try {
          await addDestinationToTrip(trip._id, selectedDestinationId);
          loadTripDetails(trip._id); 
        } catch (error) {
          alert('Failed to add destination. Please try again.');
        }
      } else {
        alert('Please select a destination to add.');
      }
    });

    const removeDestinationBtns = document.querySelectorAll('.removeDestinationBtn');
    removeDestinationBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const destinationId = e.currentTarget.dataset.destinationId;
        if (!destinationId) {
          console.error('Destination ID is undefined');
          return;
        }
        try {
          await removeDestinationFromTrip(trip._id, destinationId);
          loadTripDetails(trip._id); 
        } catch (error) {
          console.error('Error removing destination:', error);
          alert('Failed to remove destination. Please try again.');
        }
      });
    });
  } catch (error) {
    console.error('Error loading trip details:', error);
    tripDetailsContainer.innerHTML = '<p class="text-red-500">Error loading trip details. Please try again later.</p>';
  }
};

function getImageUrl(imageUrl) {
  if (typeof imageUrl === 'string') {
    return imageUrl;
  } else if (imageUrl && imageUrl.data && imageUrl.contentType) {
    return `data:${imageUrl.contentType};base64,${imageUrl.data}`;
  } else {
    return 'path/to/default/image.jpg';
  }
}
