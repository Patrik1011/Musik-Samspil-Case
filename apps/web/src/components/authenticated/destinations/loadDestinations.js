import { fetchDestinations, deleteDestination } from "../../../utils/api.js";

import { getUserSession } from "../../../utils/auth.js";

import { openEditModal } from "../modals/editDestinationModal.js";

import { openConfirmationModal } from "../modals/confirmationModal.js";

const setElementContent = (element, content) => {
  if (element) {
    element.textContent = content;
  }
};

const setupImage = (image, destination) => {
  if (image) {
    image.src = destination.image_url;

    image.alt = destination.title;

    image.onerror = () => {
      image.src = "/path/to/default/image.jpg";
    };
  }
};

const setupAdminControls = (adminControls, destination) => {
  if (adminControls) {
    adminControls.style.display = "flex";

    setupEditButton(adminControls.querySelector(".edit-button"), destination);

    setupDeleteButton(
      adminControls.querySelector(".delete-button"),
      destination
    );
  }
};

const setupEditButton = (editButton, destination) => {
  if (editButton) {
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();

      openEditModal(destination);
    });
  }
};

const setupDeleteButton = (deleteButton, destination) => {
  if (deleteButton) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openConfirmationModal(
        `Are you sure you want to delete the destination "${destination.title}"?`,
        async () => {
          try {
            await deleteDestination(destination._id);
            deleteButton.closest("li").remove();
          } catch (error) {
            console.error("Error deleting destination:", error);
            alert("Failed to delete destination. Please try again.");
          }
        }
      );
    });
  }
};

const createDestinationListItem = (destination, user) => {
  const template = document.getElementById("destinationTemplate");

  if (!template) {
    console.error("Destination template not found");

    return null;
  }

  const listItem = template.content.cloneNode(true).querySelector("li");

  if (!listItem) {
    console.error("List item not found in template");

    return null;
  }

  setElementContent(listItem.querySelector("h2"), destination.title);

  setElementContent(
    listItem.querySelector("p:nth-of-type(1)"),
    destination.country
  );

  setElementContent(
    listItem.querySelector("p:nth-of-type(2)"),
    destination.description
  );

  setupImage(listItem.querySelector("img"), destination);

  const adminControls = listItem.querySelector(".admin-controls");

  if (user?.isAdmin) {
    setupAdminControls(adminControls, destination);
  } else if (adminControls) {
    adminControls.remove();
  }

  return listItem;
};

export const loadDestinations = async () => {
  const destinationsList = document.getElementById("destinationsList");

  const user = getUserSession();

  if (!destinationsList) {
    console.error("Destinations list container not found");

    return;
  }

  try {
    const destinations = await fetchDestinations();

    destinationsList.innerHTML = "";

    if (Array.isArray(destinations) && destinations.length > 0) {
      for (const destination of destinations) {
        const listItem = createDestinationListItem(destination, user);

        if (listItem) {
          destinationsList.appendChild(listItem);
        } else {
          console.error(
            "Failed to create list item for destination:",
            destination
          );
        }
      }
    } else {
      const noDestinationsMessage = document.createElement("li");

      noDestinationsMessage.textContent = "No destinations found.";

      noDestinationsMessage.className =
        "col-span-full text-center text-gray-500";

      destinationsList.appendChild(noDestinationsMessage);
    }
  } catch (error) {
    console.error("Error fetching destinations:", error);

    const errorMessage = document.createElement("li");

    errorMessage.textContent =
      "Error loading destinations. Please try again later.";

    errorMessage.className = "col-span-full text-center text-red-500";

    destinationsList.appendChild(errorMessage);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadDestinations();
});
