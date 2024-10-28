import { stringify } from 'safe-stable-stringify';

import { getAuthToken, getUserSession } from './auth.js';

const token = getAuthToken();

export async function fetchMessage() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}`);

    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchDestinations() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/destinations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchTrips() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/trips`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Authentication failed. Please log in again.');
      }

      throw new Error('Failed to fetch trips');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);

    throw error;
  }
}

export async function fetchDestinationsById(id) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/destinations/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function postDestination(formData) {
  console.log('called with token', token);

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/destinations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create destination');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteDestination(id) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/destinations/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete destination');
    }

    return true;
  } catch (error) {
    console.error('Error deleting destination:', error);

    throw error;
  }
}

export async function updateDestination(id, formData) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/destinations/${id}`,
      {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update destination');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating destination:', error);

    throw error;
  }
}

export async function deleteTrip(tripId) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/trips/${tripId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete trip');
    }
  } catch (error) {
    console.error('Error deleting trip:', error);

    throw error;
  }
}

export async function fetchTripById(id) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/trips/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trip details');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function postTrip(formData) {
  try {
    const userSession = await getUserSession();

    const { email } = userSession;

    formData.append('email', email);

    const response = await fetch(`${process.env.API_BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create trip');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateTrip(id, formData) {
  console.log('Form data:', Object.fromEntries(formData.entries()));

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to update trip');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

export const addDestinationToTrip = async (tripId, destinationId) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/trips/${tripId}/destinations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: stringify({ destinationId })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add destination');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding destination:', error);

    throw error;
  }
};

export const removeDestinationFromTrip = async (tripId, destinationId) => {
  console.log(tripId, destinationId)
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/trips/${tripId}/destinations/${destinationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove destination');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing destination:', error);

    throw error;
  }
};
