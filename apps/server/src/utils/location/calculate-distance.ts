export interface Coordinates {
  type: string;
  coordinates: number[];
}

export const calculateDistance = (userCoords: Coordinates, ensembleCoords: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const [lon1, lat1] = userCoords.coordinates;
  const [lon2, lat2] = ensembleCoords.coordinates;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // Distance in km, rounded to nearest integer
};
