import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export interface GpsPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}


@Injectable({
  providedIn: 'root'
})
export class GpsService {
  
  private positionSubject = new Subject<GpsPosition>();  
  getCurrentPosition(): Promise<GpsPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsPosition: GpsPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          this.positionSubject.next(gpsPosition);
          resolve(gpsPosition);
        },
        (error) => {
          reject(this.getPositionError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  private getPositionError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Usuario denegó acceso a la ubicación');
      case error.POSITION_UNAVAILABLE:
        return new Error('Información de ubicación no disponible');
      case error.TIMEOUT:
        return new Error('Tiempo de espera agotado');
      default:
        return new Error('Error desconocido');
    }
  }

}
