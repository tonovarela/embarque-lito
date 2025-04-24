export interface GpsPosition {
    latitude: number;
    longitude: number;
    accuracy?: number;    
  }

  export interface GpsPositionWithType extends GpsPosition {
    type: string;
  }