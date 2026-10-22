// Haversine formula to calculate distance between two coordinates in kilometers
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const checkGeofenceStatus = (vehicle) => {
  if (!vehicle.geofence || !vehicle.geofence.centerLat || !vehicle.geofence.centerLng) {
    return { isInside: true, distanceKm: 0, breached: false };
  }

  const { centerLat, centerLng, radiusKm = 10, zoneName } = vehicle.geofence;
  const { latitude, longitude } = vehicle.current_location;

  const distance = calculateDistanceKm(latitude, longitude, centerLat, centerLng);
  const isInside = distance <= radiusKm;
  const wasInside = vehicle.geofence.isInside ?? true;

  const breached = wasInside && !isInside;

  return {
    isInside,
    distanceKm: parseFloat(distance.toFixed(2)),
    radiusKm,
    zoneName: zoneName || 'Operational Zone',
    breached,
  };
};
