// utils/distance.ts

// Haversine formula to calculate distance between two coordinates
export function distanceBetween(
    [lng1, lat1]: [number, number],
    [lng2, lat2]: [number, number]
  ): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371e3; // meters (Earth radius)
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);
  
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // in meters
  }
  