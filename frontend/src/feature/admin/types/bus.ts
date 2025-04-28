export interface Location {
    latitude: number;
    longitude: number;
  }
  
export interface Bus {
    busId: number;
    route: string;
    driverId: string; 
    location: Location;
    status: "active" | "inactive";
  }
  