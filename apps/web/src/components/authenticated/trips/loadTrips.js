import { fetchTrips, deleteTrip } from "../../../utils/api.js";
import { openEditTripModal } from "../modals/editTripModal.js";
import { openConfirmationModal } from "../modals/confirmationModal.js";

const createTripListItem = (trip) => {
  const template = document.getElementById("tripTemplate");
  if (!template) {
    console.error("Trip template not found");
    return null;
  }

  const listItem = template.content.cloneNode(true).querySelector("li");
  if (!listItem) {
    console.error("List item not found in template");
    return null;
  }

  const title = listItem.querySelector("h2");
  if (title) title.textContent = trip.title;

  const destinations = listItem.querySelector(".destinations");
  if (destinations)
    destinations.textContent = `Destinations: ${trip.destinations.length}`;

  const description = listItem.querySelector(".description");
  if (description) description.textContent = trip.description;

  const editButton = listItem.querySelector(".edit-button");
  if (editButton) {
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditTripModal(trip);
    });
  }

  const deleteButton = listItem.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openConfirmationModal(
        `Are you sure you want to delete the trip "${trip.title}"?`,
        async () => {
          try {
            await deleteTrip(trip._id);
            listItem.remove();
          } catch (error) {
            console.error("Error deleting trip:", error);
            alert("Failed to delete trip. Please try again.");
          }
        }
      );
    });
  }

  listItem.addEventListener("click", () => {
    window.location.href = `/authenticated/trips/${trip._id}`;
  });

  return listItem;
};

export const loadTrips = async () => {
  const tripsList = document.getElementById("tripsList");

  if (!tripsList) {
    console.error("Trips list container not found");
    return;
  }

  try {
    const trips = await fetchTrips();
    tripsList.innerHTML = "";

    if (Array.isArray(trips) && trips.length > 0) {
      trips.forEach((trip) => {
        const listItem = createTripListItem(trip);
        if (listItem) {
          tripsList.appendChild(listItem);
        } else {
          console.error("Failed to create list item for trip:", trip);
        }
      });
    } else {
      const noTripsMessage = document.createElement("li");
      noTripsMessage.textContent = "No trips found.";
      noTripsMessage.className = "text-center text-gray-500";
      tripsList.appendChild(noTripsMessage);
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    const errorMessage = document.createElement("li");
    errorMessage.textContent = "Error loading trips. Please try again later.";
    errorMessage.className = "text-center text-red-500";
    tripsList.appendChild(errorMessage);
  }
};

// Ensure the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  loadTrips();
});
